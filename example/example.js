var
	path = require('path'),
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
		callback: function(message) {
			console.log(message);
		}
	})
;

builder
	.build()
	.then(function() {
		console.log('Your build is done');
		console.log('Your base is: ', builder.builder.loader.pluginLoader.baseURL);
	})
	.catch(function(error) {
		console.log('Your build failed: ', error);
	});
