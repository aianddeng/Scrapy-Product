import Router = require("koa-router");
import faker = require('faker');

import book from './book';

const router = new Router();

router.get('/ip', async (ctx, next) => {
    await next();
    ctx.body = ctx.ip;
})

router.get('/faker', async (ctx, next) => {
    await next();
    ctx.body = faker.name.title();
})

router.use(book.routes());
router.use(book.allowedMethods());

export default router;