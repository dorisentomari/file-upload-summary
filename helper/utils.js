const path = require('path');
const uuid = require('uuid');
const moment = require('moment');

const BASE_URL = 'http://localhost:5800/';

function formatDate(date = new Date(), needTime = true) {
    if (needTime) {
        return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss');
    }
    return moment(new Date(date)).format('YYYY-MM-DD');
}

function genFileName(file) {
    if (!file) {
        throw new Error('genFileName params file is not exist');
    }
    const extName = file.name.split('.')[1] || '';
    return `${uuid.v4()}${extName ? '.' + extName : ''}`;
}

function genFilePath(dir, fileName) {
    return path.resolve(dir, fileName);
}

function parseFile(file) {
    const type = file.type || '';
    const size = file.size || 0;
    return {type, size};
}

function genVisitUrl(fileName, dir = 'upload/') {
    let url = BASE_URL;
    if (dir) {
        url += dir;
    }
    return url + fileName;
}

function genUuid() {
    return uuid.v4();
}

module.exports = {
    genFileName,
    genFilePath,
    formatDate,
    parseFile,
    genVisitUrl,
    genUuid,
};
