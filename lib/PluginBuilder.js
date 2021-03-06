var
	fs = require('fs'),
	path = require('path'),
	extend = require('extend'),

	Promise = require('bluebird'),

	SystemJSBuilder = require('systemjs-builder'),
	JSPMBuilder = require('jspm').Builder,

	BUILDERS = {
		systemjs: SystemJSBuilder,
		jspm: JSPMBuilder
	},

	DEFAULTS = {
		builder: 'systemjs',
		config: null,
		configPath: undefined,
		basePath: undefined,
		pluginPaths: [],
		out: '../build/',
		onMessage: function(/* message */) {}
	},

	MESSAGE_TYPE_ERROR = 'error',
	MESSAGE_TYPE_INFO = 'info',
	MESSAGE_TYPE_SUCCESS = 'success'
;

// Expose Constants:
PluginBuilder.MESSAGE_TYPE_ERROR = MESSAGE_TYPE_ERROR;
PluginBuilder.MESSAGE_TYPE_INFO = MESSAGE_TYPE_INFO;
PluginBuilder.MESSAGE_TYPE_SUCCESS = MESSAGE_TYPE_SUCCESS;

// Expose PluginBuilder:
module.exports = PluginBuilder;

function PluginBuilder(options) {
	this._options = extend({}, DEFAULTS, options);
	this._builder = new BUILDERS[this._options.builder]();
}

PluginBuilder.prototype.build = function() {
	return new Promise(function(resolve, reject) {

		this._logInfo('Start build using "' + this._options.builder + '"-builder.');

		this._loadConfig()
			.then(this._mergeConfig.bind(this))
			.then(this._buildBase.bind(this))
			.then(this._buildPlugins.bind(this))
			.then(resolve)
			.catch(reject);

	}.bind(this));
};

PluginBuilder.prototype.getConfig = function() {
	return extend({}, this._builder.loader.pluginLoader);
};

PluginBuilder.prototype._log = function(message, type) {
	this._options.onMessage({
		message: message,
		type: type
	});
};

PluginBuilder.prototype._logError = function(message) {
	this._log(message, MESSAGE_TYPE_ERROR);
};

PluginBuilder.prototype._logInfo = function(message) {
	this._log(message, MESSAGE_TYPE_INFO);
};

PluginBuilder.prototype._logSuccess = function(message) {
	this._log(message, MESSAGE_TYPE_SUCCESS);
};

PluginBuilder.prototype._getStat = function(filepath) {
	var stat = null;

	if (typeof filepath === 'string') {
		try {
			stat = fs.statSync(filepath);
		} catch(error) {}
	}

	return stat;
};

PluginBuilder.prototype._getOutpath = function(filepath, out) {
	var
		dir = path.dirname(filepath),
		name = path.basename(filepath)
	;

	return path.join(dir, out, name);
};

PluginBuilder.prototype._loadConfig = function() {
	return new Promise(function(resolve) {

		if (this._builder instanceof JSPMBuilder) {
			// jspm builder didn't need to load config...
			resolve();
			return;
		}

		var stat = this._getStat(this._options.configPath);

		if (stat && stat.isDirectory()) {
			throw new Error('Config file path is an directory');
		}

		if (stat && stat.isFile()) {
			this._builder
				.loadConfig(this._options.configPath)
				.then(resolve);
		}

	}.bind(this));
};

PluginBuilder.prototype._mergeConfig = function() {
	return new Promise(function(resolve) {

		if (this._options.config && typeof this._options.config === 'object') {
			var message = 'Use config: ';

			Object.keys(this._options.config).forEach(function(key) {
				message += key + ': "' + this._options.config[key] + '"';
			}.bind(this));

			this._logInfo(message);
			this._builder.config(this._options.config);
		}
		resolve();

	}.bind(this));
};

PluginBuilder.prototype._buildBase = function() {
	return new Promise(function(resolve, reject) {

		var
			stat = this._getStat(this._options.basePath),
			out
		;

		if (stat && stat.isFile()) {
			out = this._getOutpath(this._options.basePath, this._options.out);

			this._logInfo('Build base... ' + this._options.basePath);
			this._saveTree(this._options.basePath, out)
				.then(function(tree) {
					// Store tree of base to substract them later on when
					// build plugins:
					this._baseTree = tree;
				}.bind(this))
				.then(resolve)
				.catch(reject);
		} else {
			throw new Error('Path to base file is not valid: ' + this._options.basePath);
		}

	}.bind(this));
};

PluginBuilder.prototype._buildPlugins = function() {
	return new Promise(function(resolve, reject) {

		var
			plugin = this._options.pluginPaths.pop(),
			stat,
			out
		;

		if (!plugin) {
			resolve();
			return;
		}

		stat = this._getStat(plugin);

		if (stat && stat.isFile()) {
			out = this._getOutpath(plugin, this._options.out);

			this._logInfo('Build plugin... ' + plugin);
			this._saveTree(plugin, out, this._baseTree)
				.then(this._buildPlugins.bind(this))
				.then(resolve)
				.catch(reject);
		} else {
			throw new Error('Path to plugin file is not valid: ' + plugin);
		}
	}.bind(this));
};

PluginBuilder.prototype._saveTree = function(source, destination, substractTree) {
	return new Promise(function(resolve, reject) {

		if (source === destination) {
			throw new Error('File source and destination are equal');
		}

		source = source.replace(/\.js$/, '');

		this._builder
			.trace(source)
			.then(function(tree) {

				if (substractTree) {
					tree = this._builder.subtractTrees(tree, substractTree);
				}

				this._builder.bundle(tree, destination).then(function() {
					this._logSuccess('Saved as... ' + destination);
					resolve(tree);
				}.bind(this));
			}.bind(this))
			.catch(reject);

	}.bind(this));
};
