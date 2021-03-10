const Page = require('./Page');
const METHOD = require('./action');
const modelInit = require('./sql/model');

const task = async (url, taskModel, infoModel, category) => {
    const $ = await Page.run(METHOD.AXIOS)(url);

    let error = false;
    const isListPage = $('#searchPage a[data-style-id]').length;
    const isProduct = $('#itemInformation li').length;
    if (isListPage) {
        const productLinks = $('#searchPage a[data-style-id]').get().map(el => 'https://www.zappos.com' + $(el).attr('href')).concat(
            $('a[rel=next]').first().attr('href') ? 'https://www.zappos.com' + $('a[rel=next]').first().attr('href') : ''
        );

        // 获取到的产品链接推入任务列表（已存在的会重新获取）
        await Promise.all(
            productLinks.filter(
                Boolean
            ).map(
                productLink => taskModel.updateOne({
                    url: productLink,
                }, {
                    url: productLink,
                    status: 'waiting'
                }, {
                    upsert: true
                })
            )
        )
    } else if (isProduct) {
        const info = {
            name: $('#overview h1').text().trim(),
            description: $('#itemInformation li').text().trim(),
            path: $('#breadcrumbs a').get().slice(1).map(
                el => $(el).text()
            )
        };

        // 如果数据完整，存入数据库中
        if (info.name && info.description && info.path) {
            const data = new infoModel({
                ...info,
                category
            });
            await data.save();
        }
    } else {
        error = true;
    }

    console.log('Complete the request: ' + url);
    await taskModel.updateOne({
        url
    }, {
        status: error ? 'error' : 'finish'
    }, {
        upsert: true
    })
}

const main = category => async urls => {
    // 初始化数据模型
    const {
        taskModel,
        infoModel,
    } = await modelInit();

    // 任务列表先推入数据库
    await Promise.all(
        urls.filter(
            Boolean
        ).map(
            url => taskModel.updateOne({
                url,
            }, {
                url,
                status: 'waiting'
            }, {
                upsert: true
            })
        )
    )

    // 开始监听数据库任务列表
    while (true) {
        // 获取数据库中的未完成列表
        const taskList = await taskModel.find({
            status: 'waiting'
        });

        // 限制并发数量
        const currentList = taskList.slice(0, 25);

        // 移出队列
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
            el => task(el.url, taskModel, infoModel, category)
        );

        // 如果任务列表为空，则休眠
        if (!currentList.length) {
            console.log('Waiting new queue...');
            await new Promise(resolve => setTimeout(resolve, 30 * 1000));
        } else {
            await new Promise(resolve => setTimeout(resolve, 0.5 * 1000));
        }
    }
}

(async () => {
    const category = 'default';
    
    const urls = [
        'https://www.zappos.com/women-belt-buckles',
        'https://www.zappos.com/women-boots/CK_XARCz1wHAAQHiAgMBAhg.zso',
        'https://www.zappos.com/women-sneakers-athletic-shoes/CK_XARC81wHAAQHiAgMBAhg.zso',
    ]

    await main(category)(urls);
})();