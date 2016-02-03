'use strict';

var _ = require('lodash');
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

ZnResourceDaoFake.prototype._nextResourceId = function() {
	var resourceIds = _.values(this.resources);
	return _.max(resourceIds) || 1;
};

ZnResourceDaoFake.prototype.get = function(id) {

	if (_.isObject(id)) {
		id = id.id;
	}

	var resource = this.resources[id];

	if (!resource) {
		return Promise.reject({
			status: 404
		});
	}

	return this._returnResource(resource);
};

ZnResourceDaoFake.prototype.save = function(resource) {

	if (!resource.id) {
		resource.id = this._nextResourceId();
	}

	this.resources[resource.id] = resource;

	return this._returnResource(resource);
};

module.exports = ZnResourceDaoFake;
