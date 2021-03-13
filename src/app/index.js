const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa()
    .use(bodyParser())
    .use(async (ctx, next) => {
        console.log(`Process ${ctx.request.method} ${ctx.request.url}`);
        await next();
    });

const task = new Router({
    prefix: '/task'
}).get('/show', async (ctx, next) => {
    await next();
    ctx.body = `Process ${ctx.request.method} ${ctx.request.url}`
}).routes();

const base = new Router()
    .get('/', async (ctx, next) => {
        await next();
        console.log(ctx._matchedRoute);
        ctx.body = 'Hello, World.';
    })
    .post(['/', 'post'], async (ctx, next) => {
        await next();
        ctx.body = ctx.request.body;
    })
    .get('option', '/user/:name/:option', async (ctx, next) => {
        await next();
        ctx.body = ctx.params;
    })
    .redirect('/404', '/404notfound')
    .routes()

app.use(base).use(task).listen(4000, '0.0.0.0', () => {
    console.log('Create server on 10.1.199.12');
})