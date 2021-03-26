const mongoose = require('mongoose')

const MONGO_URL =
    process.env.NODE_ENV === 'production'
        ? 'mongodb://localhost:27017/ai_scrapy_tasks_macys'
        : 'mongodb://chase:372100@localhost:27017/ai_scrapy_tasks_macys?authSource=admin'

mongoose.Promise = Promise

mongoose.connection.once('connected', () => {
    console.log('MongoDb Connected')
})

mongoose.connection.once('disconnected', () => {
    console.log('MongoDb Disconnected')
})

mongoose.connection.on('error', err => {
    console.log('MongoDb Catch Error.', err)
})

mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useCreateIndex: true,
})

module.exports = mongoose.disconnect
