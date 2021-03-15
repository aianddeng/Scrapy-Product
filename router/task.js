const Router = require('koa-router');

const modelInit = require('../db/model');

const getTaskList = async (num = 10) => {
    const {
        taskModel
    } = await modelInit();

    console.log('start');
    const tasks = await taskModel.find({status: 'doing'});
    console.log('done');
    console.log(tasks.length);

    return tasks.slice[0, num];
}

const taskRouter = new Router({
    prefix: '/task'
})

taskRouter.get('/show', async (ctx, next) => {
    await next();

    const tasks = await getTaskList();

    ctx.body = tasks;
})

module.exports = taskRouter;