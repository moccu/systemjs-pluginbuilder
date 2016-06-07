var
	fs = require('fs'),
	path = require('path'),
	rimraf = require('rimraf'),
	Promise = require('bluebird'),
	PluginBuilder = require('../../lib/PluginBuilder')
;


exports.tests = {

	'setUp': function(done) {
		done();
	},

	'tearDown': function(done) {
		// Clean build directory after each test run....
		rimraf(path.join(__dirname, 'build'), done);
	},

	'should return a promise': function(test) {
		var
			builder = new PluginBuilder({
				builder: 'jspm',
				basePath: 'tests/jspm/fixtures/Base.js'
			}),
			promise = builder.build()
		;

		test.ok(promise instanceof Promise);
		test.done();
	},

	'should parse config.js': function(test) {
		test.expect(3);

		var
			builder = new PluginBuilder({
				builder: 'jspm',
				basePath: 'tests/jspm/fixtures/Base.js'
			})
		;

		builder
			.build()
			.finally(function() {
				var config = builder.getConfig();
				test.equal(config.paths['app/*'], 'tests/jspm/fixtures/*');
				test.equal(config.paths['github:*'], 'tests/jspm/jspm_packages/github/*');
				test.equal(config.paths['npm:*'], 'tests/jspm/jspm_packages/npm/*');
				test.done();
			});
	},

	'should merge custom config': function(test) {
		test.expect(1);

		var
			builder = new PluginBuilder({
				builder: 'jspm',
				config: {
					foo: 'bar-baz'
				},
				basePath: 'tests/jspm/fixtures/Base.js'
			})
		;

		builder
			.build()
			.then(function() {
				var config = builder.getConfig();
				test.equal(config.foo, 'bar-baz');
			})
			.finally(function() {
				test.done();
			});
	},

	'should create relative build dir': function(test) {
		test.expect(1);

		var
			builder = new PluginBuilder({
				builder: 'jspm',
				basePath: 'tests/jspm/fixtures/Base.js'
			})
		;

		builder
			.build()
			.then(function() {
				var stat = fs.statSync('tests/jspm/build');
				test.ok(stat.isDirectory());
				test.done();
			});
	},

	'should build files': function(test) {
		test.expect(3);

		var
			builder = new PluginBuilder({
				builder: 'jspm',
				basePath: 'tests/jspm/fixtures/Base.js',
				pluginPaths: [
					'tests/jspm/fixtures/PluginA.js',
					'tests/jspm/fixtures/PluginB.js'
				]
			})
		;

		builder
			.build()
			.then(function() {
				test.ok(fs.statSync('tests/jspm/build/Base.js').isFile());
				test.ok(fs.statSync('tests/jspm/build/PluginA.js').isFile());
				test.ok(fs.statSync('tests/jspm/build/PluginB.js').isFile());
				test.done();
			});
	},

	'should contain and substract modules in build files': function(test) {
		test.expect(21);

		function __contains(str, contents) {
			return new RegExp('System\.register\\((\'|")' + str + '(\'|")').test(contents);
		}

		function __excluded(str, contents) {
			return !__contains(str, contents);
		}


		var
			builder = new PluginBuilder({
				builder: 'jspm',
				basePath: 'tests/jspm/fixtures/Base.js',
				pluginPaths: [
					'tests/jspm/fixtures/PluginA.js',
					'tests/jspm/fixtures/PluginB.js'
				]
			})
		;


		builder
			.build()
			.then(function() {
				return new Promise(function(resolve, reject) {
					fs.readFile('tests/jspm/build/Base.js', 'utf8', function(error, contents) {
						if (error) {
							reject(error);
							return;
						}

						// Contains:
						test.ok(__contains('app/Base.js', contents), 'Base build contains base module');
						test.ok(__contains('app/module-a/ModuleA.js', contents), 'Base build contains module A');
						test.ok(__contains('app/module-a/SubmoduleA.js', contents), 'Base build contains submodule A');

						// Excluded:
						test.ok(__excluded('app/PluginA.js', contents), 'Base build not contains plugin A');
						test.ok(__excluded('app/PluginB.js', contents), 'Base build not contains plugin B');
						test.ok(__excluded('app/module-b/ModuleB.js', contents), 'Base build not contains module B');
						test.ok(__excluded('app/module-b/SubmoduleB.js', contents), 'Base Build not contains submodule B');

						resolve();
					});
				});
			})
			.then(function() {
				return new Promise(function(resolve, reject) {
					fs.readFile('tests/jspm/build/PluginA.js', 'utf8', function(error, contents) {
						if (error) {
							reject(error);
							return;
						}

						// Contains:
						test.ok(__contains('app/PluginA.js', contents), 'Plugin A build contains plugin A');
						test.ok(__contains('app/module-b/ModuleB.js', contents), 'Plugin A build contains module B');
						test.ok(__contains('app/module-b/SubmoduleB.js', contents), 'Plugin A build contains submodule B');

						// Excluded:
						test.ok(__excluded('app/Base.js', contents), 'Plugin A build not contains base');
						test.ok(__excluded('app/PluginB.js', contents), 'Plugin A build not contains plugin B');
						test.ok(__excluded('app/module-a/ModuleA.js', contents), 'Plugin A build not contains module A');
						test.ok(__excluded('app/module-a/SubmoduleA.js', contents), 'Plugin A build not contains submodule A');

						resolve();
					});
				});
			})
			.then(function() {
				return new Promise(function(resolve, reject) {
					fs.readFile('tests/jspm/build/PluginB.js', 'utf8', function(error, contents) {
						if (error) {
							reject(error);
							return;
						}

						// Contains:
						test.ok(__contains('app/PluginB.js', contents), 'Plugin B build contains plugin B');

						// Excluded:
						test.ok(__excluded('app/Base.js', contents), 'Plugin B build not contains base');
						test.ok(__excluded('app/PluginA.js', contents), 'Plugin B build not contains plugin A');
						test.ok(__excluded('app/module-a/ModuleA.js', contents), 'Plugin B build not contains module A');
						test.ok(__excluded('app/module-a/SubmoduleA.js', contents), 'Plugin B build not contains submodule A');
						test.ok(__excluded('app/module-b/ModuleB.js', contents), 'Plugin B build contains module B');
						test.ok(__excluded('app/module-b/SubmoduleB.js', contents), 'Plugin B build contains submodule B');

						resolve();
					});
				});
			})
			.finally(function() {
				test.done();
			});
	}
};
