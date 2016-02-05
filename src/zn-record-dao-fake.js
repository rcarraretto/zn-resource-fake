'use strict';

var _ = require('lodash');

var Promise = require('bluebird');

var ZnRecordDaoFake = function() {
	this.records = {};
};

var resolveCopy = function(record) {
	var copy = _.assign({}, record);
	return Promise.resolve(copy);
};

var notFound = function() {
	return Promise.reject({
		status: 404
	});
};

ZnRecordDaoFake.prototype.get = function(compositeId) {

	var record = _.get(this.records, compositeId.formId + '.' + compositeId.id);

	if (!record) {
		return notFound();
	}

	return resolveCopy(record);
};

var filterRecords = function(records, allParams) {

	var params = _.merge({}, allParams);
	delete params.limit;
	delete params.page;

	_.forEach(params, function(param, key) {

		records = _.filter(records, function(record) {

			var recordAttributeValue = record[key];

			if (_.isObject(recordAttributeValue)) {
				recordAttributeValue = recordAttributeValue.id;
			}

			if (_.isArray(param)) {
				return _.includes(param, recordAttributeValue);
			}

			return recordAttributeValue === param;
		});
	});

	return records;
};

ZnRecordDaoFake.prototype.query = function(request) {

	var formId = request.formId;
	var params = _.merge({}, request);
	delete params.formId;

	var formRecords = _.values(this.records[formId]);

	formRecords = filterRecords(formRecords, params);

	var response = {
		data: formRecords,
		totalCount: formRecords.length
	};

	return Promise.resolve(response);
};

ZnRecordDaoFake.prototype._getAllRecords = function() {
	return _.reduce(this.records, function(allRecords, formRecordsById) {

		var formRecords = _.values(formRecordsById);

		return allRecords.concat(formRecords);
	}, []);
};

ZnRecordDaoFake.prototype._nextRecordId = function(formId) {
	var allRecords = this._getAllRecords();
	var allRecordIds = _.map(allRecords, 'id');
	var highestId = _.max(allRecordIds) || 0;
	return highestId + 1;
};

ZnRecordDaoFake.prototype._get = function(formId, recordId) {

	var formRecords = this.records[formId];

	if (!formRecords) {
		return null;
	}

	return this.records[formId][recordId];
};

ZnRecordDaoFake.prototype._set = function(formId, record) {

	var formRecords = this.records[formId];

	if (!formRecords) {
		this.records[formId] = {};
	}

	this.records[formId][record.id] = record;
};

ZnRecordDaoFake.prototype._create = function(record) {

	var formId = record.formId;

	record.id = this._nextRecordId(formId);

	this._set(formId, record);

	return resolveCopy(record);
};

ZnRecordDaoFake.prototype._update = function(record) {

	var formId = record.formId;

	var dbRecord = this._get(formId, record.id);

	if (dbRecord) {
		record = _.assign(dbRecord, record);
	}

	this._set(formId, record);

	return resolveCopy(record);
};

ZnRecordDaoFake.prototype.save = function(record) {

	if (!record.formId) {
		return notFound();
	}

	if (record.id) {
		return this._update(record);
	}

	return this._create(record);
};

module.exports = ZnRecordDaoFake;
