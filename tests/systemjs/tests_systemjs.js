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
		rimraf(path.join(__dirname, 'build'), function() {
			done();
		});
	},

	'should return a promise': function(test) {
		var
			builder = new PluginBuilder({
				builder: 'systemjs',
				config: {baseURL: '.'},
				configPath: 'tests/systemjs/config.js',
				basePath: 'tests/systemjs/fixtures/Base.js'
			}),
			promise = builder.build()
		;

		test.ok(promise instanceof Promise);
		test.done();
	},

	'should parse config.js': function(test) {
		test.expect(2);

		var
			builder = new PluginBuilder({
				builder: 'systemjs',
				configPath: 'tests/systemjs/config.js',
				basePath: 'tests/systemjs/fixtures/Base.js'
			})
		;

		builder
			.build()
			.finally(function() {
				var config = builder.getConfig();
				test.equal(config.paths['*'], '*.js');
				test.equal(config.paths['app/*'], 'tests/systemjs/fixtures/*.js');
				test.done();
			});
	},

	'should merge custom config': function(test) {
		test.expect(1);

		var
			builder = new PluginBuilder({
				builder: 'systemjs',
				config: {
					foo: 'bar-baz'
				},
				configPath: 'tests/systemjs/config.js',
				basePath: 'tests/systemjs/fixtures/Base.js'
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
				builder: 'systemjs',
				config: {baseURL: '.'},
				configPath: 'tests/systemjs/config.js',
				basePath: 'tests/systemjs/fixtures/Base.js'
			})
		;

		builder
			.build()
			.then(function() {
				var stat = fs.statSync('tests/systemjs/build');
				test.ok(stat.isDirectory());
				test.done();
			});
	},

	'should build files': function(test) {
		test.expect(3);

		var
			builder = new PluginBuilder({
				builder: 'systemjs',
				config: {baseURL: '.'},
				configPath: 'tests/systemjs/config.js',
				basePath: 'tests/systemjs/fixtures/Base.js',
				pluginPaths: [
					'tests/systemjs/fixtures/PluginA.js',
					'tests/systemjs/fixtures/PluginB.js'
				]
			})
		;

		builder
			.build()
			.then(function() {
				test.ok(fs.statSync('tests/systemjs/build/Base.js').isFile());
				test.ok(fs.statSync('tests/systemjs/build/PluginA.js').isFile());
				test.ok(fs.statSync('tests/systemjs/build/PluginB.js').isFile());
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
				builder: 'systemjs',
				config: {baseURL: '.'},
				configPath: 'tests/systemjs/config.js',
				basePath: 'tests/systemjs/fixtures/Base.js',
				pluginPaths: [
					'tests/systemjs/fixtures/PluginA.js',
					'tests/systemjs/fixtures/PluginB.js'
				]
			})
		;


		builder
			.build()
			.then(function() {
				return new Promise(function(resolve, reject) {
					fs.readFile('tests/systemjs/build/Base.js', 'utf8', function(error, contents) {
						if (error) {
							reject(error);
							return;
						}

						// Contains:
						test.ok(__contains('app/Base', contents), 'Base build contains base module');
						test.ok(__contains('app/module-a/ModuleA', contents), 'Base build contains module A');
						test.ok(__contains('app/module-a/SubmoduleA', contents), 'Base build contains submodule A');

						// Excluded:
						test.ok(__excluded('app/PluginA', contents), 'Base build not contains plugin A');
						test.ok(__excluded('app/PluginB', contents), 'Base build not contains plugin B');
						test.ok(__excluded('app/module-b/ModuleB', contents), 'Base build not contains module B');
						test.ok(__excluded('app/module-b/SubmoduleB', contents), 'Base Build not contains submodule B');

						resolve();
					});
				});
			})
			.then(function() {
				return new Promise(function(resolve, reject) {
					fs.readFile('tests/systemjs/build/PluginA.js', 'utf8', function(error, contents) {
						if (error) {
							reject(error);
							return;
						}

						// Contains:
						test.ok(__contains('app/PluginA', contents), 'Plugin A build contains plugin A');
						test.ok(__contains('app/module-b/ModuleB', contents), 'Plugin A build contains module B');
						test.ok(__contains('app/module-b/SubmoduleB', contents), 'Plugin A build contains submodule B');

						// Excluded:
						test.ok(__excluded('app/Base', contents), 'Plugin A build not contains base');
						test.ok(__excluded('app/PluginB', contents), 'Plugin A build not contains plugin B');
						test.ok(__excluded('app/module-a/ModuleA', contents), 'Plugin A build not contains module A');
						test.ok(__excluded('app/module-a/SubmoduleA', contents), 'Plugin A build not contains submodule A');

						resolve();
					});
				});
			})
			.then(function() {
				return new Promise(function(resolve, reject) {
					fs.readFile('tests/systemjs/build/PluginB.js', 'utf8', function(error, contents) {
						if (error) {
							reject(error);
							return;
						}

						// Contains:
						test.ok(__contains('app/PluginB', contents), 'Plugin B build contains plugin B');

						// Excluded:
						test.ok(__excluded('app/Base', contents), 'Plugin B build not contains base');
						test.ok(__excluded('app/PluginA', contents), 'Plugin B build not contains plugin A');
						test.ok(__excluded('app/module-a/ModuleA', contents), 'Plugin B build not contains module A');
						test.ok(__excluded('app/module-a/SubmoduleA', contents), 'Plugin B build not contains submodule A');
						test.ok(__excluded('app/module-b/ModuleB', contents), 'Plugin B build contains module B');
						test.ok(__excluded('app/module-b/SubmoduleB', contents), 'Plugin B build contains submodule B');

						resolve();
					});
				});
			})
			.finally(function() {
				test.done();
			});
	},

	'should fail when passing wrong path to base file': function(test) {
		test.expect(1);

		new PluginBuilder({
			builder: 'systemjs',
			config: {baseURL: '.'},
			configPath: 'tests/systemjs/config.js',
			basePath: 'tests/systemjs/fixtures/not-exists/Base.js'
		})
			.build()
			.catch(function(error) {
				test.equal(error.message, 'Path to base file is not valid: tests/systemjs/fixtures/not-exists/Base.js');
				test.done();
			});
	},

	'should fail when passing wrong path to plugin file': function(test) {
		test.expect(1);

		new PluginBuilder({
			builder: 'systemjs',
			config: {baseURL: '.'},
			configPath: 'tests/systemjs/config.js',
			basePath: 'tests/systemjs/fixtures/Base.js',
			pluginPaths: [
				'tests/systemjs/fixtures/not-exists/PluginA.js',
				'tests/systemjs/fixtures/PluginB.js'
			]
		})
			.build()
			.catch(function(error) {
				test.equal(error.message, 'Path to plugin file is not valid: tests/systemjs/fixtures/not-exists/PluginA.js');
				test.done();
			});
	},

	'should fail when base contains wrong module paths': function(test) {
		test.expect(1);

		new PluginBuilder({
			builder: 'systemjs',
			config: {baseURL: '.'},
			configPath: 'tests/systemjs/config.js',
			basePath: 'tests/systemjs/fixtures/BaseInvalid.js'
		})
			.build()
			.catch(function(error) {
				test.ok(error.message.indexOf('Error on fetch for app/not-exists/module-a/ModuleA') > -1);
				test.done();
			});
	},

	'should fail when plugin contains wrong module paths': function(test) {
		test.expect(1);

		new PluginBuilder({
			builder: 'systemjs',
			config: {baseURL: '.'},
			configPath: 'tests/systemjs/config.js',
			basePath: 'tests/systemjs/fixtures/Base.js',
			pluginPaths: [
				'tests/systemjs/fixtures/PluginAInvalid.js',
				'tests/systemjs/fixtures/PluginB.js'
			]
		})
			.build()
			.catch(function(error) {
				test.ok(error.message.indexOf('Error on fetch for app/not-exists/module-a/ModuleA') > -1);
				test.done();
			});
	}
};
