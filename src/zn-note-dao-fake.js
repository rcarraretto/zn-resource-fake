'use strict';

var _ = require('lodash');

var ZnResourceDaoFake = require('./zn-resource-dao-fake.js');

var ZnNoteDaoFake = function() {
	ZnResourceDaoFake.call(this);
};

ZnNoteDaoFake.prototype = _.create(ZnResourceDaoFake.prototype);

ZnNoteDaoFake.prototype._formatResource = function(resource) {

	resource.workspace = {
		id: resource.workspaceId
	};

	resource.record = {
		id: resource.recordId
	};

	return resource;
};

module.exports = ZnNoteDaoFake;
