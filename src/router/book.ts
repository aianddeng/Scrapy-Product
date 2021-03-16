import Router = require("koa-router");
import {
    book
} from '../database/book';

const router = new Router({
    prefix: '/book'
})

router.get('/view', async (ctx, next) => {
    await next();
    ctx.body = await book.find({});
})

router.post('/add', async (ctx, next) => {
    await next();
    const data = ctx.request.body;
    addBook(data); // async function
    return 200;
})

const addBook = async (data) => {
    const line = await book.insertMany([
        data
    ]);

    return line[0].id;
}

export default router;