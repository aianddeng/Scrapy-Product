const mongoose = require('mongoose');

(async () => {
    const base_mongodb_url = 'mongodb://localhost:27017/scrapy_tasks'

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


