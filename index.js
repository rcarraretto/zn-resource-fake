'use strict';

var ZnFactoryFake = require('./src/zn-factory-fake.js');

var instantiateResourceService = function(options) {

	var factory = new ZnFactoryFake();

	if (options.resource === 'record') {
		return factory.ZnRecordService();
	}

	if (options.resource === 'activity') {
		return factory.ZnActivityDao();
	}

	if (options.resource === 'note') {
		return factory.ZnNoteDao();
	}

	throw new Error('ZnResourceFake: invalid resource: ' + options.resource);
};

module.exports = instantiateResourceService;
