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

		it('should save activity', function(done) {

			var activity = {
				id: 12
			};

			znActivityDaoFake.save(activity);

			znActivityDaoFake.get(12).then(function(dbActivity) {
				expect(dbActivity.id).toEqual(activity.id);
				done();
			});
		});

		it('should save different activities', function(done) {

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

			Promise.all([p1, p2]).then(function(dbActivities) {
				expect(dbActivities[0].id).toEqual(activity1.id);
				expect(dbActivities[1].id).toEqual(activity2.id);
			})
			.catch(function(err) {
				fail(err);
			})
			.finally(function() {
				done();
			});
		});

		it('should return saved activity as resolved promised', function(done) {

			var activity = {
				id: 12
			};

			znActivityDaoFake.save(activity).then(function(dbActivity) {
				expect(dbActivity.id).toEqual(activity.id);
				expect(dbActivity instanceof ZnActivity).toBe(true);
				done();
			});
		});

	});

	describe('save (when create)', function() {

		it('should set an id and save values', function(done) {

			var activity = {
				record: {
					id: 456
				}
			};

			znActivityDaoFake.save(activity)
				.then(function(activity) {
					expect(activity.id).toEqual(1);
					expect(activity.record.id).toEqual(456);
				})
				.catch(function(err) {
					fail(err.status);
				})
				.finally(function() {
					done();
				});
		});
	});

	describe('get', function() {

		it('should return activity as resolved promised', function(done) {

			var activity = {
				id: 12
			};
			znActivityDaoFake.save(activity);

			znActivityDaoFake.get(12).then(function(dbActivity) {
				expect(dbActivity.id).toEqual(activity.id);
				expect(dbActivity instanceof ZnActivity).toBe(true);
				done();
			});
		});

		it('should return error, if activity is not found', function(done) {

			znActivityDaoFake.get(12)
				.then(function(dbRecord) {
					fail();
				})
				.catch(function(err) {
					expect(err.status).toEqual(404);
				})
				.finally(function() {
					done();
				});
		});
	});

});
