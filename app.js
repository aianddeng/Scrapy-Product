const Koa = require('koa');
const cors = require('koa-cors');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');

const router = require('./router/router');
const timeLogger = require('./middleware/timeLogger');

const config = require('./config');

const app = new Koa();

app.use(timeLogger());

app.use(cors());
app.use(bodyParser());
app.use(static(__dirname, 'public'));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port, config.host, () => {
    console.log('Process start listen...');
});