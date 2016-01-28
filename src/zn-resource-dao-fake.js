'use strict';

var Promise = require('bluebird');

var ZnResourceDaoFake = function() {
	this.resources = {};
};

ZnResourceDaoFake.prototype._formatResource = function(resource) {
	return resource;
};

ZnResourceDaoFake.prototype._returnResource = function(resource) {
	return Promise.resolve(this._formatResource(resource));
};

ZnResourceDaoFake.prototype.get = function(id) {

	var resource = this.resources[id];

	if (!resource) {
		return Promise.reject({
			status: 404
		});
	}

	return this._returnResource(resource);
};

ZnResourceDaoFake.prototype.save = function(resource) {

	this.resources[resource.id] = resource;

	return this._returnResource(resource);
};

module.exports = ZnResourceDaoFake;
