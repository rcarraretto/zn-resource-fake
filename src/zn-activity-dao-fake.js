'use strict';

var _ = require('lodash');
var ZnActivity = require('zn-resource')('activity');

var ZnResourceDaoFake = require('./zn-resource-dao-fake.js');

var ZnActivityDaoFake = function() {
	ZnResourceDaoFake.call(this);
};

ZnActivityDaoFake.prototype = _.create(ZnResourceDaoFake.prototype);

ZnActivityDaoFake.prototype._formatResource = function(resource) {
	return new ZnActivity(resource);
};

module.exports = ZnActivityDaoFake;
