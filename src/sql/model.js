const mongoose = require('./index');

const modelInit = async () => {
    const taskSchema = await mongoose.Schema({
        url: {
            type: String,
            unique: true,
            required: true
        },
        status: {
            type: String,
            default: 'waiting',
            required: true,
        },
    }, {
        versionKey: false,
        timestamps: true
    })

    const taskModel = mongoose.model('tasks', taskSchema);

    const infoSchema = await mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        path: {
            type: [String],
            required: true
        },
        category: {
            type: String,
            required: true
        },
    }, {
        versionKey: false,
        timestamps: true
    })

    const infoModel = mongoose.model('infos', infoSchema);

    return {
        taskModel,
        infoModel
    };
}

module.exports = modelInit