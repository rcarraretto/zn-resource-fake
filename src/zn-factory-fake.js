'use strict';

var ZnHttpStub = function() {};

var ZnActivityDaoFake = require('./zn-activity-dao-fake.js');
var ZnNoteDaoFake = require('./zn-note-dao-fake.js');
var ZnRecordDaoFake = require('./zn-record-dao-fake.js');
var znRecordService = require('zn-resource')({ resource: 'record', ZnHttp: ZnHttpStub });

var ZnFactoryFake = function() {

};

ZnFactoryFake.prototype.ZnActivityDao = function() {
	return new ZnActivityDaoFake();
};

ZnFactoryFake.prototype.ZnNoteDao = function() {
	return new ZnNoteDaoFake();
};

ZnFactoryFake.prototype.ZnRecordService = function() {
	znRecordService.znRecordDao = new ZnRecordDaoFake();
	znRecordService.znNoteDao = new ZnNoteDaoFake();
	return znRecordService;
};

module.exports = ZnFactoryFake;
