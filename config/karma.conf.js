/*jslint node: true */
"use strict";

module.exports = function(config) {
	config.set({
		basePath : '../',
		frameworks : [ 'jasmine' ],
		files : [ 'libs/angular/angular.js', 'libs/angular-route/angular-route.js',
				'libs/angular-mocks/angular-mocks.js', 'app/**/*.js',
				'tests/**/*.js', 'app/templates/*.html' ],
		preprocessors : {
			'app/templates/*.html' : 'ng-html2js',
			'app/**/*.js' : [ 'coverage' ]
		},
		junitReporter : {
			outputFile : 'results/TEST-units.xml',
			suite : ''
		},
		coverageReporter : {
			type : 'lcov',
			dir : 'results/',
			subdir : '.'
		},
		reporters : [ 'progress' ],
		colors : true,
		autoWatch : false,
		browsers : [ 'PhantomJS' ],
		singleRun : true,
		plugins : [ 'karma-phantomjs-launcher', 'karma-jasmine',
				'karma-ng-html2js-preprocessor', 'karma-junit-reporter',
				'karma-coverage' ]
	});
};
