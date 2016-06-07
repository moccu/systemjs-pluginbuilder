var
	PluginBuilder = require('../lib/PluginBuilder'),
	builder = new PluginBuilder({
		config: {
			baseURL: '.',
		},
		configPath: 'config.js',
		basePath: 'src/Base.js',
		pluginPaths: [
			'src/PluginA.js',
			'src/PluginB.js'
		],
		out: '../build/',
		onMessage: function(data) {
			global.console.log('[' + data.type + '] ' + data.message);
		}
	})
;

builder
	.build()
	.then(function() {
		global.console.log('Your build is done');
	})
	.catch(function(error) {
		global.console.error('Your build failed: ', error);
	});
