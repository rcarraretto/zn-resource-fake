'use strict';

describe('ZnActivityDaoFake', function() {

	var Promise = require('bluebird');

	var ZnActivityDaoFake = require('../src/zn-activity-dao-fake.js');
	var ZnActivity = require('zn-resource')('activity');

	var znActivityDaoFake;

	beforeEach(function() {
		znActivityDaoFake = new ZnActivityDaoFake();
	});

	describe('save', function() {

		it('should save activity', function() {

			var activity = {
				id: 12
			};

			znActivityDaoFake.save(activity);

			return znActivityDaoFake.get(12).then(function(dbActivity) {
				expect(dbActivity.id).to.equal(activity.id);
			});
		});

		it('should save different activities', function() {

			var activity1 = {
				id: 12
			};

			var activity2 = {
				id: 13
			};

			znActivityDaoFake.save(activity1);
			znActivityDaoFake.save(activity2);

			var p1 = znActivityDaoFake.get(12);
			var p2 = znActivityDaoFake.get(13);

			return Promise.all([p1, p2]).then(function(dbActivities) {
				expect(dbActivities[0].id).to.equal(activity1.id);
				expect(dbActivities[1].id).to.equal(activity2.id);
			});
		});

		it('should return saved activity as resolved promised', function() {

			var activity = {
				id: 12
			};

			return znActivityDaoFake.save(activity).then(function(dbActivity) {
				expect(dbActivity.id).to.equal(activity.id);
				expect(dbActivity instanceof ZnActivity).to.equal(true);
			});
		});

	});

	describe('save (when create)', function() {

		it('should set an id and save values', function() {

			var activity = {
				record: {
					id: 456
				}
			};

			return znActivityDaoFake.save(activity)
				.then(function(activity) {
					expect(activity.id).to.equal(1);
					expect(activity.record.id).to.equal(456);
				});
		});
	});

	describe('get', function() {

		it('should return activity as resolved promised', function() {

			var activity = {
				id: 12
			};
			znActivityDaoFake.save(activity);

			return znActivityDaoFake.get(12).then(function(dbActivity) {
				expect(dbActivity.id).to.equal(activity.id);
				expect(dbActivity instanceof ZnActivity).to.equal(true);
			});
		});

		it('should return error, if activity is not found', function() {

			return znActivityDaoFake.get(12)
				.then(function(dbRecord) {
					fail();
				})
				.catch(function(err) {
					expect(err.status).to.equal(404);
				});
		});
	});

});
