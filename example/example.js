var
	PluginBuilder = require('../lib/PluginBuilder'),
	builder = new PluginBuilder({
		config: {
			baseURL: '.',
		},
		configPath: 'config.js',
		basePath: 'src/Base.js',
		pluginPathes: [
			'src/PluginA.js',
			'src/PluginB.js'
		],
		out: '../build/',
		onMessage: function(message) {
			global.console.log(message);
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
