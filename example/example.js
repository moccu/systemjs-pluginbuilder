var
	path = require('path'),
	PluginBuilder = require('../lib/PluginBuilder'),
	builder = new PluginBuilder({
		config: {
			// baseURL: '.'
		},
		configPath: path.join(__dirname, 'config.js')
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
