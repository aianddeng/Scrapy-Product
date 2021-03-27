const taskModel = require('./dbHelpers/Task')
const infoModel = require('./dbHelpers/Info')

const task = require('./task')
const Page = require('./Page')
const axios = require('axios')

const main = async targets => {
    // 插入任务
    const checkTaskTarget = async target => {
        const oldDocument = await taskModel.findOne({
            url: target.url,
        })

        if (oldDocument) return

        try {
            const data = new taskModel({
                url: target.url,
                category: target.category,
            })

            await data.save()
        } catch {
            console.log('> error for new model (task init)')
        }
    }
    await Promise.all(targets.map(el => checkTaskTarget(el)))

    // 进入程序时修改doing任务状态
    await taskModel.updateMany(
        {
            status: 'doing',
        },
        {
            status: 'waiting',
        }
    )

    let task_end = 0
    let oldTaskList = []
    // 开始监听数据库任务列表
    while (true) {
        // 获取数据库中的等待进行的列表
        const taskList = await taskModel.find({
            status: 'waiting',
        })

        // 如果任务列表为空，则休眠（先判断，后动作）
        if (!(taskList.length + oldTaskList.length)) {
            console.log('Waiting new queue...')
            await new Promise(resolve =>
                setTimeout(resolve, task_end * 1 * 1000)
            )

            if (task_end > 30) {
                console.log('wait more that 30/each')
                break
            } else if (task_end > 10) {
                console.log('wait more that 10/each')
                oldTaskList = [
                    ...(await taskModel.find({
                        status: 'doing',
                    })),
                    ...(await taskModel.find({
                        status: 'error',
                    })),
                ]
            } else if (task_end > 5) {
                console.log('wait more that 5/each')
                oldTaskList = await taskModel.find({
                    status: 'error',
                })
            } else {
                task_end++
            }
        } else {
            task_end = 0
        }

        while (taskList.length + oldTaskList.length) {
            // 限制并发数量
            const currentList = oldTaskList.length
                ? oldTaskList.splice(0, 5)
                : taskList.splice(0, 5)

            // 改变状态
            await taskModel.updateMany(
                {
                    $or: currentList.map(el => ({
                        url: el.url,
                    })),
                },
                {
                    status: 'doing',
                }
            )

            // 抛出异步任务
            currentList.map(el =>
                task(el)({
                    taskModel,
                    infoModel,
                })
            )

            const checkPageLength = async () => {
                await new Promise(resolve => setTimeout(resolve, 1000))

                if (Page.browser) {
                    const pages = await Page.browser.pages()
                    if (pages.length > 5) {
                        return await checkPageLength()
                    }
                }

                return
            }

            await checkPageLength()
        }
    }
}

module.exports = main
