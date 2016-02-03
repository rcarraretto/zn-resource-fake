'use strict';

describe('ZnActivityDaoFake', function() {

	var znRecordServiceFake;

	beforeEach(function() {
		znRecordServiceFake = require('../index.js')({ resource: 'record' });
	});

	describe('addNote / getNote', function() {

		it('should save / get note', function() {

			var save = function() {
				return znRecordServiceFake.addNote({
					workspaceId: 10,
					recordId: 580,
					body: 'Hello'
				});
			};

			var get = function(response) {
				expect(response).to.exist;
				expect(response.id).to.exist;

				return znRecordServiceFake.getNote({
					workspaceId: 10,
					recordId: 580,
					id: response.id
				}).then(function(note) {
					expect(note.workspace.id).to.equal(10);
					expect(note.record.id).to.equal(580);
					expect(note.body).to.equal('Hello');
				});
			};

			return save().then(get);
		});

	});
});
