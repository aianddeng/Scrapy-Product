import {
    model,
    Schema
} from './';

const bookSchema = new Schema({
    url: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        default: 'waiting',
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        default: 0,
        min: -1,
        max: 1
    }
}, {
    versionKey: false,
    timestamps: true
})

export const book = model('book', bookSchema);