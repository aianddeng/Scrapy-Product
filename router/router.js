const Router = require('koa-router');

const task = require('./task');

const router = new Router();

router.get('/ip', async (ctx, next) => {
    await next();
    ctx.body = ctx.ip;
})

router.use(task.routes());

module.exports = router;