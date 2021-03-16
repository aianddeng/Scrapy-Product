// Koa 本体
const Koa = require('koa');
const app = new Koa();

// 官方中间件
const cors = require('koa2-cors');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');

// 自定义中间件
const router = require('./router/router');
const timeLogger = require('./middleware/timeLogger');

// 导入配置
const config = require('./config');
const {
    connect
} = require('./db');
connect();

app.use(timeLogger());

app.use(cors());
app.use(bodyParser());
app.use(static(__dirname + '/public'));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port, config.host, () => {
    console.log('Process start run...');
});