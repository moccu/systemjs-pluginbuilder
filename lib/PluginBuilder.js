var
	fs = require('fs'),
	path = require('path'),
	merge = require('merge'),

	Promise = require("bluebird"),
	Builder = require('systemjs-builder'),

	DEFAULTS = {
		config: {},
		configPath: undefined,
		basePath: undefined,
		pluginPathes: undefined,
		out: '../build/'
	}
;


function PluginBuilder(options) {
	this.options = merge({}, DEFAULTS, options);
	this.builder = new Builder();
}

PluginBuilder.prototype.build = function() {
	return new Promise(function(resolve, reject) {
		this._loadConfig()
			.then(function() {
				console.log('Do the next thing after loading config');
			})
			.then(resolve)
			.error(reject);
	}.bind(this));
};

PluginBuilder.prototype._loadConfig = function() {
	return new Promise(function(resolve, reject) {
		var stat = null;

		if (typeof this.options.configPath === 'string') {
			// Can fail hardly...
			stat = fs.statSync(this.options.configPath);
		}

		if (stat && stat.isDirectory()) {
			reject(new Error('Config file path is an directory'));
		}

		if (stat && stat.isFile()) {
			this.builder
				.loadConfig(this.options.configPath)
				.then(function() {
					this._mergeConfig().then(resolve);
				}.bind(this))
		} else {
			this._mergeConfig()
				.then(resolve)
				.error(reject);
		}
	}.bind(this));
};

PluginBuilder.prototype._mergeConfig = function() {
	return new Promise(function(resolve, reject) {
		this.builder.config(this.options.config);
		resolve();
	}.bind(this));
};

// Expose PluginBuilder:
module.exports = PluginBuilder;
