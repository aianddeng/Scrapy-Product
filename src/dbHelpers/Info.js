const mongoose = require('mongoose')

const infoSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        path: {
            type: [String],
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
)

const infoModel = mongoose.model('infos', infoSchema)

module.exports = infoModel
