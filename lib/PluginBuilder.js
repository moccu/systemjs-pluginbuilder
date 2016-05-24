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
		pluginPathes: [],
		out: '../build/',
		onMessage: function(/* message */) {}
	}
;


function PluginBuilder(options) {
	this.options = merge({}, DEFAULTS, options);
	this.builder = new Builder();
}

PluginBuilder.prototype.build = function() {
	return new Promise(function(resolve, reject) {

		this._loadConfig()
			.then(this._buildBase.bind(this))
			.then(this._buildPlugins.bind(this))
			.then(resolve)
			.error(reject);

	}.bind(this));
};

PluginBuilder.prototype._getStat = function(path) {
	var stat = null;

	if (typeof path === 'string') {
		try {
			stat = fs.statSync(path);
		} catch(error) {}
	}

	return stat;
}

PluginBuilder.prototype._getOutpath = function(filepath, out) {
	var
		dir = path.dirname(filepath),
		name = path.basename(filepath)
	;

	return path.join(dir, out, name);
};

PluginBuilder.prototype._loadConfig = function() {
	return new Promise(function(resolve, reject) {

		var stat = this._getStat(this.options.configPath);

		if (stat && stat.isDirectory()) {
			reject(new Error('Config file path is an directory'));
		}

		if (stat && stat.isFile()) {
			this.builder
				.loadConfig(this.options.configPath)
				.then(this._mergeConfig.bind(this))
				.then(resolve);
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

PluginBuilder.prototype._buildBase = function() {
	return new Promise(function(resolve, reject) {

		var
			stat = this._getStat(this.options.basePath),
			out
		;

		if (stat && stat.isFile()) {
			out = this._getOutpath(this.options.basePath, this.options.out);

			this.options.onMessage('Build base... ' + this.options.basePath);
			this._saveTree(this.options.basePath, out)
				.then(function(tree) {
					// Store tree of base to substract them later on when
					// build plugins:
					this._baseTree = tree;
				}.bind(this))
				.then(resolve);
		} else {
			reject(new Error('Path to base file is not valid'));
		}

	}.bind(this));
};

PluginBuilder.prototype._buildPlugins = function() {
	return new Promise(function(resolve, reject) {

		var
			plugin = this.options.pluginPathes.pop(),
			stat,
			out
		;

		if (!plugin) {
			resolve();
			return;
		}

		stat = this._getStat(plugin);

		if (stat && stat.isFile()) {
			out = this._getOutpath(plugin, this.options.out);

			this.options.onMessage('Build plugin... ' + plugin);
			this._saveTree(plugin, out, this._baseTree)
				.then(this._buildPlugins.bind(this))
				.then(resolve)
				.error(reject);
		}
	}.bind(this));
};

PluginBuilder.prototype._saveTree = function(source, destination, substractTree) {
	return new Promise(function(resolve, reject) {

		if (source === destination) {
			reject(new Error('File source and destination are equal'));
			return;
		}

		source = source.replace(/\.js$/, '');

		this.builder
			.trace(source)
			.then(function(tree) {

				if (substractTree) {
					tree = this.builder.subtractTrees(tree, substractTree);
				}

				this.builder.buildTree(tree, destination).then(function() {
					this.options.onMessage('Saved as... ' + destination);
					resolve(tree);
				}.bind(this));
			}.bind(this))
			.catch(reject);

	}.bind(this));
};

// Expose PluginBuilder:
module.exports = PluginBuilder;
