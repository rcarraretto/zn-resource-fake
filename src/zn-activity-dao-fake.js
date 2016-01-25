'use strict';

var _ = require('lodash');

var ZnResourceDaoFake = require('./zn-resource-dao-fake.js');

var ZnActivityDaoFake = function() {
	ZnResourceDaoFake.call(this);
};

ZnActivityDaoFake.prototype = _.create(ZnResourceDaoFake.prototype);

module.exports = ZnActivityDaoFake;
