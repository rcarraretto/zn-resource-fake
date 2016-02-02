'use strict';

describe('ZnRecordDaoFake', function() {

	var Promise = require('bluebird');

	var ZnRecordDaoFake = require('../src/zn-record-dao-fake.js');

	var znRecordDaoFake;

	beforeEach(function() {
		znRecordDaoFake = new ZnRecordDaoFake();
	});

	describe('save', function () {

		describe('without id', function() {

			it('should set an id (i.e. create)', function() {

				var record = {
					formId: 5,
					field123: 'apples'
				};

				return znRecordDaoFake.save(record)
					.then(function(record) {
						expect(record.id).to.equal(1);
					});
			});

			it('should save values', function() {

				var record = {
					formId: 5,
					field123: 'apples'
				};

				var assertWasSaved = function(savedRecord) {

					var compositeId = {
						formId: 5,
						id: savedRecord.id
					};

					return znRecordDaoFake.get(compositeId)
						.then(function(dbRecord) {
							expect(dbRecord.id).to.equal(savedRecord.id);
							expect(dbRecord.formId).to.equal(5);
							expect(dbRecord.field123).to.equal('apples');
						});
				};

				return znRecordDaoFake.save(record).then(assertWasSaved);
			});
		});

		describe('with id', function() {

			it('should update provided values and preserve the others', function() {

				var saveInitialRecord = function() {

					var record = {
						id: 12,
						formId: 5,
						field1: 'apples',
						field2: 'python'
					};

					return znRecordDaoFake.save(record);
				};

				var updateRecord = function() {

					var recordUpdate = {
						id: 12,
						formId: 5,
						field2: 'ruby'
					};

					return znRecordDaoFake.save(recordUpdate);
				};

				var assertWasUpdated = function() {

					var compositeId = {
						formId: 5,
						id: 12
					};

					return znRecordDaoFake.get(compositeId).then(function(dbRecord) {
						expect(dbRecord.id).to.equal(12);
						expect(dbRecord.formId).to.equal(5);
						expect(dbRecord.field1).to.equal('apples');
						expect(dbRecord.field2).to.equal('ruby');
					});
				};

				return saveInitialRecord().then(updateRecord).then(assertWasUpdated);
			});
		});

		it('should save different records', function() {

			var record1 = {
				id: 12,
				formId: 5
			};

			var record2 = {
				id: 13,
				formId: 5
			};

			var record3 = {
				id: 100,
				formId: 6
			};

			znRecordDaoFake.save(record1);

			znRecordDaoFake.save(record2);

			znRecordDaoFake.save(record3);

			var p1 = znRecordDaoFake.get({
				formId: 5,
				id: 12
			});

			var p2 = znRecordDaoFake.get({
				formId: 5,
				id: 13
			});

			var p3 = znRecordDaoFake.get({
				formId: 6,
				id: 100
			});

			return Promise.all([p1, p2, p3]).then(function(dbRecords) {
				expect(dbRecords[0]).to.eql(record1);
				expect(dbRecords[1]).to.eql(record2);
				expect(dbRecords[2]).to.eql(record3);
			});
		});

		it('should use the highest id creating new records', function() {

			znRecordDaoFake.save({
				id: 30,
				formId: 1
			});

			znRecordDaoFake.save({
				id: 100,
				formId: 2
			});

			var p1 = znRecordDaoFake.save({
				formId: 1
			});

			var p2 = znRecordDaoFake.save({
				formId: 2
			});

			var checkIds = function(dbRecords) {
				expect(dbRecords[0].id).to.equal(101);
				expect(dbRecords[1].id).to.equal(102);
			};

			return Promise.all([p1, p2]).then(checkIds);
		});

		describe('when no formId is set', function() {

			it('should reject as not found', function() {

				var record = {
					field123: 'apples'
				};

				return znRecordDaoFake.save(record)
					.then(function() {
						fail();
					})
					.catch(function(err) {
						expect(err.status).to.equal(404);
					});
			});
		});
	});

	describe('get', function() {

		it('should return error, if form id does not match', function() {

			var record = {
				id: 12,
				formId: 5
			};

			znRecordDaoFake.save(record);

			return znRecordDaoFake.get({
				formId: 6,
				id: 12
			})
			.then(function(dbRecord) {
				fail();
			})
			.catch(function(err) {
				expect(err.status).to.equal(404);
			});
		});
	});

	describe('query', function() {

		it('should query records belonging to a form', function() {

			var record1 = {
				id: 12,
				formId: 5
			};

			var record2 = {
				id: 13,
				formId: 5
			};

			var record3 = {
				id: 100,
				formId: 6
			};

			znRecordDaoFake.save(record1);

			znRecordDaoFake.save(record2);

			znRecordDaoFake.save(record3);

			return znRecordDaoFake.query({
				formId: 5
			})
			.then(function(result) {
				expect(result.totalCount).to.equal(2);
				expect(result.data[0]).to.equal(record1);
				expect(result.data[1]).to.equal(record2);
			});
		});

		describe('when no records are found', function() {

			it('should return totalCount 0 and empty data array', function() {

				return znRecordDaoFake.query({
					formId: 5
				})
				.then(function(result) {
					expect(result.totalCount).to.equal(0);
					expect(result.data).to.eql([]);
				});
			});
		});

		describe('with field123 param as string', function() {

			it('should filter by field', function() {

				var record1 = {
					id: 12,
					formId: 5,
					field123: 'apples'
				};

				var record2 = {
					id: 13,
					formId: 5,
					field123: 'oranges'
				};

				var record3 = {
					id: 14,
					formId: 5,
					field123: 'apples'
				};

				znRecordDaoFake.save(record1);
				znRecordDaoFake.save(record2);
				znRecordDaoFake.save(record3);

				var request = {
					formId: 5,
					field123: 'apples'
				};

				return znRecordDaoFake.query(request)
					.then(function(result) {
						expect(result.totalCount).to.equal(2);
						expect(result.data[0]).to.equal(record1);
						expect(result.data[1]).to.equal(record3);
					});
			});
		});

		describe('with field123 param as array', function() {

			it('should filter by field values as OR statement', function() {

				var record1 = {
					id: 12,
					formId: 5,
					field123: 'apples'
				};

				var record2 = {
					id: 13,
					formId: 5,
					field123: 'oranges'
				};

				var record3 = {
					id: 14,
					formId: 5,
					field123: 'strawberries'
				};

				znRecordDaoFake.save(record1);
				znRecordDaoFake.save(record2);
				znRecordDaoFake.save(record3);

				var request = {
					formId: 5,
					field123: ['apples', 'strawberries']
				};

				return znRecordDaoFake.query(request)
					.then(function(result) {
						expect(result.totalCount).to.equal(2);
						expect(result.data[0]).to.equal(record1);
						expect(result.data[1]).to.equal(record3);
					});
			});
		});

		it('should not use limit and page params to filter values', function() {

			var record1 = {
				id: 12,
				formId: 5,
				field123: 'apples'
			};

			var record2 = {
				id: 13,
				formId: 5,
				field123: 'oranges'
			};

			var record3 = {
				id: 14,
				formId: 5,
				field123: 'apples'
			};

			znRecordDaoFake.save(record1);
			znRecordDaoFake.save(record2);
			znRecordDaoFake.save(record3);

			var request = {
				formId: 5,
				field123: 'apples',
				page: 1,
				limit: 500
			};

			return znRecordDaoFake.query(request)
				.then(function(result) {
					expect(result.totalCount).to.equal(2);
					expect(result.data[0]).to.equal(record1);
					expect(result.data[1]).to.equal(record3);
				});
		});

		it('should keep request as is', function() {

			var request = {
				formId: 5
			};

			return znRecordDaoFake.query(request)
				.then(function(result) {
					expect(request).to.eql({
						formId: 5
					});
				});
		});
	});
});
