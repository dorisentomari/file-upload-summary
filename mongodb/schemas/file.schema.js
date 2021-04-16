const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commonFields = require('../comonFields');
const utils = require('../../helper/utils');

const fileSchema = new Schema({
    title: { type: String, default: '' },
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    size: { type: Number, default: 0 },
    ...commonFields,
}, {
    toObject: {
        transform(doc, ret) {
            ret.createTime = utils.formatDate(ret.createTime);
            ret.updateTime = utils.formatDate(ret.updateTime);
            delete ret.__v;
        }
    }
});

const FileModel = model('file', fileSchema);

module.exports = FileModel;
