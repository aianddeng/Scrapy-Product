const Page = require('./Page');
const METHOD = require('./action');
const modelInit = require('./sql/model');
const hanleCollect = require('./stores');

const task = async (
    {
        url,
        category
    },
    {
        taskModel,
        infoModel
    }
) => {
    // fake
    if ([
        'https://www.zappos.com/p/colovos-seamed-leg-buckle-jeans-medium-fade/product/9372018/color/737576',
    ].includes(url)) {
        await taskModel.updateOne({
            url
        }, {
            status: 'finish',
            type: -1
        }, {
            upsert: true
        })
        return;
    }

    const $ = await Page.run(METHOD.AXIOS)(url);

    const hostname = (new URL(url)).hostname;
    const handle = require(hanleCollect.find(
        el => el.origin.includes(hostname)
    ).handle);
    const {
        error,
        outOfStock,
        product_info,
        product_links,
    } = handle($);

    const checkTaskUrl = async (url) => {
        const oldDocument = await taskModel.findOne({
            url
        });

        return oldDocument ? '' : url;
    }

    if (product_info) {
        const oldDocument = await infoModel.findOne({
            url
        });

        if (oldDocument) return;

        const data = new infoModel({
            url,
            category,
            ...product_info,
        });

        await data.save();
    } else if (product_links) {
        for await (const url of product_links.map(checkTaskUrl)) {
            url && await taskModel.updateOne({
                url,
            }, {
                url,
                status: 'waiting',
                type: 0,
                category: category
            }, {
                upsert: true
            })
        }
    }

    console.log('Complete the request: ' + url);
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

    // 任务列表先推入数据库
    await Promise.all(
        targets.filter(
            el => el.url && el.category
        ).map(
            target => taskModel.updateOne({
                url: target.url,
            }, {
                url: target.url,
                status: 'waiting',
                type: 0,
                category: target.category
            }, {
                upsert: true
            })
        )
    )

    let task_end = 0;

    // 首次进入程序需获取上次未完成任务列表
    const oldTaskList = [...await taskModel.find({
        status: 'doing'
    }), ...await taskModel.find({
        status: 'error'
    })]

    // 开始监听数据库任务列表
    while (true) {
        // 获取数据库中的等待进行的列表
        const taskList = await taskModel.find({
            status: 'waiting'
        });

        // 限制并发数量
        const currentList = oldTaskList.length
            ? oldTaskList.splice(0, 5)
            : taskList.slice(0, 5);

        // 改变状态
        await Promise.all(currentList.map(
            el => taskModel.updateOne({
                url: el.url
            }, {
                status: 'doing'
            }, {
                upsert: true
            })
        ));

        // 抛出异步任务
        currentList.map(
            el => task(el, {
                taskModel,
                infoModel
            })
        );

        // 如果任务列表为空，则休眠
        if (!currentList.length) {
            if (task_end > 30) {
                break;
            }
            task_end++;

            console.log('Waiting new queue...');
            await new Promise(resolve => setTimeout(resolve, task_end * 2 * 1000));
        } else {
            task_end = 0;
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }
}

(async () => {
    const targets = [
        {
            category: 'Belt Buckles',
            url: 'https://www.zappos.com/women-belt-buckles',
            store: 'zappos',
        },
        {
            category: 'Boots',
            url: 'https://www.zappos.com/women-boots/CK_XARCz1wHAAQHiAgMBAhg.zso',
            store: 'zappos',
        },
        {
            category: 'Athletic Shoes',
            url: 'https://www.zappos.com/women-sneakers-athletic-shoes/CK_XARC81wHAAQHiAgMBAhg.zso',
            store: 'zappos',
        }
    ]

    await main(targets);
})();