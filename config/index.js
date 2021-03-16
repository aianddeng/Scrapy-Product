const dotenv = require('dotenv');

dotenv.config({
    path: process.env.NODE_ENV === 'development'
        ? './.env.dev'
        : './.env.prod'
});

module.exports = {
    mongodbUrl: 'mongodb://chase:372100@35.194.30.4:29991/ai_scrapy_tasks_new_2?authSource=admin',
    host: '0.0.0.0',
    port: 80
}