const config = require('../config');

const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connection.on('connected', () => {
    console.log('MongoDb Connected.');
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDb Disconnected.');
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDb Catch Error.', err);
});

exports.connect = () => mongoose.connect(
    config.mongodbUrl, {
    useUnifiedTopology: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useCreateIndex: true,
}) && mongoose;

exports.disconnect = () => mongoose.disconnect();

exports.Schema = mongoose.Schema;