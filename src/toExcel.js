const mongoose = require('./sql');
const Helpers = require('./Helpers');

const modelInit = async () => {
    const taskSchema = await mongoose.Schema({
        url: {
            type: String,
            unique: true,
            required: true
        },
        finish: {
            type: Boolean,
            default: false,
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
        }
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

(async () => {
    // 初始化数据模型
    const {
        taskModel,
        infoModel,
    } = await modelInit();

    // 获取数据库中的未完成列表
    const infoList = (await infoModel.find({})).filter(el => el.name && el.description && el.path).map(
        el => ({
            name: el.name,
                description: el.description,
            path: el.path.join('/')          
        })
    );

    const data = {};

    if (infoList.length) {
        data['Belt Buckles'] = infoList;

        console.log('infoList length: ', infoList.length);

        infoList.length && await Helpers.writeToExcel(data)
    }
})();