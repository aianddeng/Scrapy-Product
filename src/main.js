const Page = require('./Page');
const METHOD = require('./action');
const modelInit = require('./sql/model');
const hanleCollect = require('./stores');

const task = ({
    url,
    category
}) => async ({
    taskModel,
    infoModel
}) => {
        // 分类足够，自动退出
        const cat = await infoModel.find({
            category
        })

        if (cat.length >= 1000) {
            await taskModel.updateMany({
                $or: [{
                    status: 'waiting'
                }, {
                    status: 'doing'
                }, {
                    status: 'error'
                }],
                category
            }, {
                status: 'oversize',
                type: -1
            });

            console.log('Oversize the request: ' + url);
            console.log({
                category,
                length: cat.length
            });

            return;
        }

        // 如果没有mappings则直接退出
        const hostname = (new URL(url)).hostname;

        const handleTarget = hanleCollect.find(
            el => el.origin.includes(hostname)
        )

        if (!handleTarget) {
            await taskModel.updateOne({
                url
            }, {
                status: 'error',
                type: -1
            }, {
                upsert: true
            });
            return;
        }

        // 选择方法
        let method = null;
        if (
            url.match(/^https:\/\/www\.ebay\.com\/(b|sch)\/(.+)/)
        ) {
            method = METHOD.PUPPETEER
        } else {
            method = METHOD.AXIOS
        }

        const $ = await Page.run(method)(url);

        const handle = require(handleTarget.handle);

        const {
            error,
            outOfStock,
            product_info,
            product_links,
        } = handle($, url);

        const checkTaskTarget = async (target) => {
            const oldDocument = await taskModel.findOne({
                url: target.url
            });

            if (oldDocument) return;

            try {
                const data = new taskModel({
                    url: target.url,
                    category: target.category
                });

                await data.save();
            } catch {
                console.log('> error for new model (task)');
            }

            return;
        }

        const filterTaskTarget = async (url) => {
            const oldDocument = await taskModel.findOne({
                url
            });

            return oldDocument ? '' : url;
        }

        const checkInfoTarget = async (target) => {
            const oldDocument = await infoModel.findOne({
                url: target.url
            });

            if (oldDocument) return;

            try {
                const data = new infoModel({
                    url: target.url,
                    category: target.category,
                    ...product_info,
                });

                await data.save();
            } catch {
                console.log('> error for new model (info)');
            }

            return;
        }

        if (product_info) {
            await checkInfoTarget({
                url,
                category,
                product_info
            });
        } else if (product_links) {
            try {
                const rightProductLinks = await Promise.all(
                    product_links.filter(
                        el => el.startsWith('http')
                    ).map(
                        filterTaskTarget
                    )
                );

                await taskModel.insertMany(
                    rightProductLinks
                        .filter(Boolean)
                        .map(el => ({
                            url: el,
                            category
                        }))
                )
            } catch {
                console.log('> error for new model (task)');
            }
        }

        console.log('Complete the request: ' + url);
        console.log({
            error,
            outOfStock,
            data: product_info ? product_info.name : (product_links ? product_links.length : undefined)
        });

        await taskModel.updateOne({
            url
        }, {
            status: error ? 'error' : (outOfStock ? 'soldOut' : 'finish'),
            type: error ? -1 : (product_info ? 1 : 0)
        }, {
            upsert: true
        })
    }

const main = async targets => {
    // 初始化数据模型
    const {
        taskModel,
        infoModel,
    } = await modelInit();

    const checkTaskTarget = async (target) => {
        const oldDocument = await taskModel.findOne({
            url: target.url
        });

        if (oldDocument) return;

        try {
            const data = new taskModel({
                url: target.url,
                category: target.category
            });

            await data.save();
        } catch {
            console.log('> error for new model (task init)');
        }
    }

    await Promise.all(targets.map(el => checkTaskTarget(el)))

    // 首次进入程序需获取上次未完成任务列表
    let task_end = 0;
    let oldTaskList = await taskModel.find({
        status: 'doing'
    });

    // 开始监听数据库任务列表
    while (true) {
        // 获取数据库中的等待进行的列表
        const taskList = await taskModel.find({
            status: 'waiting'
        });

        // 如果任务列表为空，则休眠（先判断，后动作）
        if (!taskList.length) {
            if (task_end > 30) break;

            task_end++;

            console.log('Waiting new queue...');

            await new Promise(resolve => setTimeout(resolve, task_end * 2 * 1000));

            if (task_end > 5) {
                oldTaskList = await taskModel.find({
                    status: 'error'
                });
            }

            if (task_end > 10) {
                oldTaskList = [...await taskModel.find({
                    status: 'doing'
                }), ...await taskModel.find({
                    status: 'error'
                })]
            }
        } else {
            task_end = 0;
        }

        while (taskList.length || oldTaskList.length) {
            // 限制并发数量
            const currentList = oldTaskList.length
                ? oldTaskList.splice(0, 4)
                : taskList.reverse().splice(0, 4);

            // 改变状态
            await taskModel.updateMany({
                $or: currentList.map(el => ({
                    url: el.url
                }))
            }, {
                status: 'doing'
            })

            // 抛出异步任务
            currentList.map(
                el => task(el)({
                    taskModel,
                    infoModel
                })
            );

            // 等待1秒
            const uiTask = taskList.map(el => el.url).filter(url => url.match(/^https:\/\/www\.ebay\.com\/(b|sch)\/(.+)/));
            
            await new Promise(resolve => setTimeout(resolve, 0.6 * 1000 + (uiTask.length * 1.5)));
        }
    }
}

module.exports = main;