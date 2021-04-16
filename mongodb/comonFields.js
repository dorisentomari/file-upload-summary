const commonFields = {
	createTime: { type: Date, default: new Date() },
	updateTime: { type: Date, default: new Date() },
	remark: { type: String, default: '' },
};

module.exports = commonFields;
