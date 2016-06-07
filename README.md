# systemjs-pluginbuilder

A systemJS build tool to create plugin based bundles.

[![Travis Status](https://travis-ci.org/moccu/systemjs-pluginbuilder.png?branch=master)](https://travis-ci.org/moccu/systemjs-pluginbuilder)

This project allows builds of systemjs based modules. The key features are the
separated build outputs. The main build, called _base_ build, is ment to contain
all required modules and libraries. On the other hand there can exist smaller
builds called _plugins_ which only contain all modules which are missing in the
_base_ build. This approach allows to ship builds on websites, where the _base_
script is cached by the browser while _plugins_ can be exchanged on each site
and keep the traffic low.

### Tasks

If you're looking for a [gruntjs](http://gruntjs.com/) to build your
files, take a look at this one: [grunt-systemjs-pluginbuilder](https://github.com/moccu/grunt-systemjs-pluginbuilder)

## Installation

This package is available on [npm](https://www.npmjs.com/package/systemjs-pluginbuilder)
as: `systemjs-pluginbuilder`

``` sh
	npm install systemjs-pluginbuilder
```

## Options

### ```builder```

This defines the builder which should be used. There are currently two possible
values: ```systemjs``` and ```jspm```. Each value reffers to a specific builder:

* ```systemjs``` uses the [systemjs-builder](https://github.com/systemjs/builder)
* ```jspm``` uses the [included builder](https://github.com/jspm/jspm-cli/blob/master/lib/bundle.js) of [jspm](https://github.com/jspm/jspm-cli)

The default value of this option is ```systemjs```.

**Attention:** When using ```jspm``` as builder, the ```configPath``` option will
be ignored. The builder uses the con figured path to the configfile inside the
```package.json```. You also should not rewrite the ```baseURL``` property using
the ```config``` option. This value can be defined in the ```package.json``` too.

```javascript
	builder: 'systemjs'
```

### ```configPath```

This sets the path to the systemjs config file. This is option is required when
using the ```systemjs``` builder.

```javascript
	configPath: 'js/src/config.js'
```

### ```config```

This option allows to add or overwrite settings from the loaded config file.

```javascript
	config: {
		paths: {
			'app/*': 'js/src/*'
		}
	}
```

### ```basePath```

This is the path to the _base_ file. The path should be defined as ```string```.
This option is _required_.

```javascript
	basePath: 'js/src/Base.js'
```

### ```pluginPathes```

This is a list of all _plugin_ files. The build of these files will have a
substracted module tree of the _base_ file. The pathes will be defined as
```array of strings```.

```javascript
	pluginPathes: [
		'js/src/PluginA.js',
		'anywhere/else/src/PluginB.js'
	]
```

### ```out```

This defines the relative output path for builded _base_ and _plugin_ files. The
path is defined relative to each source file (defined by ```basePath``` and
```pluginPathes```). The default value is ```'../build/'```.

```javascript
	out: '../build/'
```

*Examle:* When using ```'../build/'``` as ```out``` option and the _base_ file
is located in ```js/src/Base.js``` the build output will be located at
```js/build/Base.js```.

## Functions

An instance of the *PluginBuilder* has the following methods

### ```new PluginBuilder(options)```

The constructor will create an instance of the pluginbuilder. You can pass the
*options* as properties of an object into the constructor. The available options
are documented [here](#options).

```javascript
	var PluginBuilder = require('systemjs-pluginbuilder'),
	var builder = new PluginBuilder({
		basePath: 'jsr/src/Base.js',
		pluginPathes: [
			'js/src/PluginA.js',
			'js/src/PluginB.js'
		]
	});
```

### ```build()```

When calling this function, a build will be generated with the given options
from the constructor. This function returns a promise to handle the async build
process.

```javascript
	builder
		.build()
		.then(function() {
			global.console.log('Your build is done');
		})
		.catch(function(error) {
			global.console.error('Your build failed: ', error);
		});
```

## Examples

An example is located in [the example directory](example/). Simply checkout this
repository, call ```npm install``` and run ```node example/example.js```. This
example will create a _build_ directory in ```example/build```.

## Contribution

Feel free to contribute. Please run all the tests and validation tasks before
you offer a pull request.

### Tests & validation

Run ```grunt validate test``` to run the tests and validation tasks.

### Readme

The readme chapters are located in the _docs_ directory as Markdown. All
Markdown files will be concatenated through a grunt task ```'docs'```. Call
```grunt docs``` or run it fully by call ```grunt``` to validate, test and
update the _README.md_.

**Note:** Do not edit the _README.md_ directly, it will be overwritten!

## License

[LICENSE (MIT)](https://github.com/moccu/systemjs-pluginbuilder/blob/master/LICENSE)
