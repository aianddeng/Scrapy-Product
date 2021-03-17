const mongoose = require('mongoose');

(async () => {
    const base_mongodb_url = process.env.NODE_ENV === 'development'
        ? 'mongodb://localhost:27017/ai_scrapy_tasks_new_2'
        : 'mongodb://chase:372100@localhost:29991/ai_scrapy_tasks_new_2?authSource=admin'

    mongoose.Promise = Promise;

    mongoose.connection.once('connected', () => {
        console.log('MongoDb Connected');
    });

    mongoose.connection.once('disconnected', () => {
        console.log('MongoDb Disconnected');
    });

    mongoose.connection.on('error', (err) => {
        console.log('MongoDb Catch Error.', err);
    });

    await mongoose.connect(base_mongodb_url, {
        useUnifiedTopology: true,
        useFindAndModify: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    })
})();

module.exports = mongoose;


