var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var ngTemplates = require('../index');
var path = require('path');

describe('gulp-ng-templates', function () {
	it('should build html templates', function (done) {
		var file, contents;

		contents = '<div class="row">' +
			'<div class="large-12 columns"></div>' +
		'</div>';

		file = new File({
			path: path.join(__dirname, 'template-1.html'),
			base: path.join(__dirname),
			contents: new Buffer(contents)
		});

		var stream = ngTemplates('moduleName', 'templates.js');

		stream.on('data', function (file) {
			assert(!file.isStream());
			assert.equal(file.contents.toString('utf-8'), 'angular.module("moduleName", []).run(["$templateCache", function($templateCache) {$templateCache.put("/template-1.html","<div class=\\"row\\"><div class=\\"large-12 columns\\"></div></div>");}]);');
			assert.equal(file.path.replace(file.base + '/', ''), 'templates.js');
			done();
		});

		stream.write(file);

		stream.end();
	});

	it('should build jade templates', function (done) {
		var file, contents;

		contents = "html\n"+
		"  head\n"+
		"    title Website title\n"+
		"  body\n"+
		"    .row\n"+
		"      .large-12.columns";

		file = new File({
			path: path.join(__dirname, 'template-1.html'),
			base: path.join(__dirname),
			contents: new Buffer(contents)
		});

		var stream = ngTemplates({
			engine: 'jade'
		});

		stream.on('data', function (file) {
			assert(!file.isStream());
			assert.equal(file.contents.toString('utf-8'), 'angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/template-1.html","<html><head><title>Website title</title></head><body><div class=\\"row\\"><div class=\\"large-12 columns\\"></div></div></body></html>");}]);');
			done();
		});

		stream.write(file);

		stream.end();
	});
});