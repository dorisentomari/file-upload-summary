const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const express = require('express');
const formidable = require('formidable');
const FileSchema = require('../mongodb/schemas/file.schema');
const utils = require('../helper/utils');

const route = express.Router();

const uploadDir = path.resolve(__dirname, '../static/upload');
const uploadTempDir = path.resolve(__dirname, '../temp');

// 普通文件上传 normal-file-upload
route.post('/normal-file-upload', async (req, res) => {
    const form = new formidable.IncomingForm({uploadDir, multiples: false});
    let params = {};
    form.parse(req);
    form.on('error', error => {
        res.status(500).json({msg: error.msg});
    });
    form.on('file', (formName, file) => {
        if (formName === 'avatar') {
            const fileName = utils.genFileName(file);
            params.avatar = file;
            params.fileName = fileName;
            fs.renameSync(file.path, utils.genFilePath(uploadDir, fileName));
        }
    });
    form.on('end', async () => {
        const {size, type} = utils.parseFile(params.avatar);
        const schema = {name: params.fileName, title: params.fileTitle || '', size, type};
        schema.visitUrl = utils.genVisitUrl(req, params.fileName, 'upload/');
        await FileSchema.create(schema);
        res.json(schema);
    });
});

// delete file
route.post('/delete-file', async (req, res) => {
    const _id = req.body._id;
    const file = await FileSchema.findByIdAndDelete(_id);
    const fileName = file.name;
    try {
        fs.unlinkSync(utils.genFilePath(uploadDir, fileName));
    } catch (err) {

    }
    return res.json(file);
});

// 大文件上传 big-file-upload
// 先分块上传文件，然后将文件合并。
// 上传的时候，记录一个参数 key，放在数据库中，记录时间
// 合并的时候，也拿到这个 key，开始合并文件
// 合并完成之后，删除参数 key，保存在 file 数据表中
route.post('/big-file-upload', async (req, res) => {
    const form = new formidable.IncomingForm({uploadDir: uploadTempDir, multiples: false});
    form.parse(req);
    form.on('error', error => {
        console.log('error', error);
        res.status(500).json({msg: error.msg});
    });
    form.on('file', async (formName, file) => {
        if (formName === 'fileHolder') {
            const [fName, index, fExtName] = file.name.split('.');
            const tempDirPath = path.resolve(uploadTempDir, fName);
            const filePath = path.resolve(uploadTempDir, fName, index);
            !fse.existsSync(tempDirPath) && fse.mkdirpSync(tempDirPath);
            await fse.move(file.path, filePath, {overwrite: true});
        }
    });
    form.on('end', async () => {
        return res.json({msg: '上传成功'});
    });
});

// 大文件上传合并，big-file-upload/merge
route.post('/big-file-upload/merge', async (req, res) => {
    const name = req.body.name;
    const filePath = path.resolve(uploadDir, name);
    const fName = name.split('.')[0];
    const chunkDir = path.resolve(uploadTempDir, fName);
    const chunks = fs.readdirSync(chunkDir);
    chunks.sort((a, b) => a - b).forEach(chunkPath => {
        fs.appendFileSync(filePath, fs.readFileSync(path.resolve(chunkDir, chunkPath)));
    });
    fse.removeSync(chunkDir);
    const fileStat = fs.statSync(filePath);
    const {size, type} = utils.parseFile(fileStat);
    const schema = {name: utils.genUuid(), title: name, size, type};
    schema.visitUrl = utils.genVisitUrl(req, schema.name, 'upload/');
    await FileSchema.create(schema);
    res.json(schema);
});

module.exports = route;
