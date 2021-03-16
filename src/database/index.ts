import mongoose = require('mongoose');

import config from '../config';

mongoose.connection.once('connected', () => {
    console.log('Database connected.');
})

mongoose.connection.once('disconnected', () => {
    console.log('Database disconnected.');
})

mongoose.connection.on('error', (err) => {
    console.error(err);
})

export default () => {
    mongoose.connect(config.database.url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    });

    return mongoose;
}

export const Schema = mongoose.Schema;

export const model = mongoose.model;