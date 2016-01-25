'use strict';

var Jasmine = require('jasmine');
var jasmine = new Jasmine(); // jshint ignore:line

var SpecReporter = require("jasmine-spec-reporter");

var specReporter = new SpecReporter({
	// display stacktrace for each failed assertion, values: (all|specs|summary|none)
	displayStacktrace: 'all',
	// display summary of all failures after execution
	displayFailuresSummary: false,
	// display summary of all pending specs after execution
	displayPendingSummary: true,
	// display each successful spec
	displaySuccessfulSpec: false,
	// display each failed spec
	displayFailedSpec: true,
	// display each pending spec
	displayPendingSpec: false,
	// display each spec duration
	displaySpecDuration: false,
	// display each suite number (hierarchical)
	displaySuiteNumber: false
});

jasmine.addReporter(specReporter);

jasmine.loadConfigFile('test/support/jasmine.json');

jasmine.execute();
