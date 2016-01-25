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

			it('should set an id (i.e. create) and save values', function(done) {

				var record = {
					formId: 5,
					field123: 'apples'
				};

				znRecordDaoFake.save(record)
					.then(function(record) {
						expect(record.id).toEqual(1);
						expect(record.field123).toEqual('apples');
					})
					.catch(function(err) {
						fail(err.status);
					})
					.finally(function() {
						done();
					});
			});

			it('should save values', function(done) {

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
							expect(dbRecord.id).toEqual(savedRecord.id);
							expect(dbRecord.formId).toEqual(5);
							expect(dbRecord.field123).toEqual('apples');
						})
						.catch(function(err) {
							fail(err.status);
						})
						.finally(function() {
							done();
						});
				};

				znRecordDaoFake.save(record).then(assertWasSaved);
			});
		});

		describe('with id', function() {

			it('should update provided values and preserve the others', function(done) {

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
						expect(dbRecord.id).toEqual(12);
						expect(dbRecord.formId).toEqual(5);
						expect(dbRecord.field1).toEqual('apples');
						expect(dbRecord.field2).toEqual('ruby');
						done();
					});
				};

				saveInitialRecord().then(updateRecord).then(assertWasUpdated);
			});
		});

		it('should save different records', function(done) {

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

			Promise.all([p1, p2, p3]).then(function(dbRecords) {
				expect(dbRecords[0]).toEqual(record1);
				expect(dbRecords[1]).toEqual(record2);
				expect(dbRecords[2]).toEqual(record3);
			})
			.catch(function(err) {
				fail(err);
			})
			.finally(function() {
				done();
			});
		});

		describe('when no formId is set', function() {

			it('should reject as not found', function(done) {

				var record = {
					field123: 'apples'
				};

				znRecordDaoFake.save(record)
					.then(function() {
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

	describe('get', function() {

		it('should return error, if form id does not match', function(done) {

			var record = {
				id: 12,
				formId: 5
			};

			znRecordDaoFake.save(record);

			znRecordDaoFake.get({
				formId: 6,
				id: 12
			})
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

	describe('query', function() {

		it('should query records belonging to a form', function(done) {

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

			znRecordDaoFake.query({
				formId: 5
			})
			.then(function(result) {
				expect(result.totalCount).toEqual(2);
				expect(result.data[0]).toEqual(record1);
				expect(result.data[1]).toEqual(record2);
			})
			.catch(function(err) {
				fail(err);
			})
			.finally(function() {
				done();
			});
		});

		describe('when no records are found', function() {

			it('should return totalCount 0 and empty data array', function(done) {

				znRecordDaoFake.query({
					formId: 5
				})
				.then(function(result) {
					expect(result.totalCount).toEqual(0);
					expect(result.data).toEqual([]);
				})
				.catch(function(err) {
					fail(err);
				})
				.finally(function() {
					done();
				});
			});
		});

		describe('with field123 param as string', function() {

			it('should filter by field', function(done) {

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

				znRecordDaoFake.query(request)
					.then(function(result) {
						expect(result.totalCount).toEqual(2);
						expect(result.data[0]).toEqual(record1);
						expect(result.data[1]).toEqual(record3);
					})
					.catch(function(err) {
						fail(err);
					})
					.finally(function() {
						done();
					});
			});
		});

		describe('with field123 param as array', function() {

			it('should filter by field values as OR statement', function(done) {

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

				znRecordDaoFake.query(request)
					.then(function(result) {
						expect(result.totalCount).toEqual(2);
						expect(result.data[0]).toEqual(record1);
						expect(result.data[1]).toEqual(record3);
					})
					.catch(function(err) {
						fail(err);
					})
					.finally(function() {
						done();
					});
			});
		});

		it('should not use limit and page params to filter values', function(done) {

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

			znRecordDaoFake.query(request)
				.then(function(result) {
					expect(result.totalCount).toEqual(2);
					expect(result.data[0]).toEqual(record1);
					expect(result.data[1]).toEqual(record3);
				})
				.catch(function(err) {
					fail(err);
				})
				.finally(function() {
					done();
				});
		});

		it('should keep request as is', function(done) {

			var request = {
				formId: 5
			};

			znRecordDaoFake.query(request)
				.then(function(result) {
					expect(request).toEqual({
						formId: 5
					});
				})
				.finally(function() {
					done();
				});
		});
	});
});
