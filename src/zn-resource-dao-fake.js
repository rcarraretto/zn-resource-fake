'use strict';

var Promise = require('bluebird');

var ZnResourceDaoFake = function() {
	this.resources = {};
};

ZnResourceDaoFake.prototype.get = function(id) {

	var resource = this.resources[id];

	if (!resource) {
		return Promise.reject({
			status: 404
		});
	}

	return Promise.resolve(resource);
};

ZnResourceDaoFake.prototype.save = function(resource) {

	this.resources[resource.id] = resource;

	return Promise.resolve(resource);
};

module.exports = ZnResourceDaoFake;
