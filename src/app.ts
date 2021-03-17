import Koa = require('koa');
import cors = require('koa2-cors');
import staticFile = require('koa-static');
import bodyParser = require('koa-bodyparser');

import config from './config/config.default';
import router from './router';
import connect from './database';
import {
    book
} from './database/book';
import timeLogger from './middleware/timeLogger';

connect();

const app = new Koa();

app.use(
    timeLogger()
).use(
    cors()
).use(
    bodyParser()
).use(
    staticFile(__dirname + '/public')
).use(
    router.routes()
).use(
    router.allowedMethods()
)

app.listen(
    config.server.port,
    config.server.hostname,
    () => {
        console.log('Process start...');
    }
)