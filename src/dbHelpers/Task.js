const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            unique: true,
            required: true,
        },
        status: {
            type: String,
            default: 'waiting',
        },
        category: {
            type: String,
            required: true,
        },
        type: {
            type: Number,
            default: 0,
            min: -1,
            max: 1,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
)

const taskModel = mongoose.model('tasks', taskSchema)

module.exports = taskModel
