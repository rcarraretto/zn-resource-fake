'use strict';

describe('znNoteDaoFake', function() {

	var znNoteDaoFake;

	beforeEach(function() {
		znNoteDaoFake = require('../index.js')({ resource: 'note' });
	});

	describe('save', function() {

		it('should save note', function() {

			var save = function() {
				return znNoteDaoFake.save({
					workspaceId: 10,
					recordId: 580,
					body: 'Hello'
				});
			};

			var get = function(response) {
				expect(response).to.exist;
				expect(response.id).to.exist;

				return znNoteDaoFake.get(response.id).then(function(note) {
					expect(note.workspace.id).to.equal(10);
					expect(note.record.id).to.equal(580);
					expect(note.body).to.equal('Hello');
				});
			};

			return save().then(get);
		});

	});
});
