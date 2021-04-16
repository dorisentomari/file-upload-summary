const express = require('express');

const FileSchema = require('../mongodb/schemas/file.schema');
const utils = require('../helper/utils');

const route = express.Router();

const commonParams = {
    uploadSuccess: '上传成功(upload success)',
    uploadFail: '上传失败(upload fail)'
};

const homeView = {
    path: '/',
    title: '文件上传',
    descri: ''
};

const normalFileUploadView = {
    path: 'normal-file-upload',
    title: '普通文件上传',
    descri: ''
};

const bigFileUploadView = {
    path: 'big-file-upload',
    title: '大文件上传',
    descri: ''
};

const multipleFileUploadView =  {
    path: 'multiple-files-upload',
    title: '选择文件上传',
    descri: '先选择多个文件到浏览器中，然后选择某几个文件上传到服务端'
}

const renderViewsList = [homeView, normalFileUploadView, bigFileUploadView, multipleFileUploadView];

route.get('/', async (req, res) => {
    let imageList =  await FileSchema.find();
    imageList = imageList.map(item => {
        item.visitUrl = utils.genVisitUrl(item.name);
        return item;
    });
    return res.render('index.njk', { imageList, renderViewsList, ...homeView });
});

route.get(`/normal-file-upload`, (req, res) => {
    res.render(`normal-file-upload.njk`, {renderViewsList, ...normalFileUploadView, ...commonParams});
});

route.get(`/big-file-upload`, (req, res) => {
    res.render(`big-file-upload.njk`, {renderViewsList, ...bigFileUploadView, ...commonParams});
});

route.get(`/multiple-files-upload`, (req, res) => {
    res.render(`multiple-files-upload.njk`, {renderViewsList, ...multipleFileUploadView, ...commonParams});
});

module.exports = route;
