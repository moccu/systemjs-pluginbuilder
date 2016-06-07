## Options

### ```builder```

This defines the builder which should be used. There are currently two possible
values: ```systemjs``` and ```jspm```. Each value refers to a specific builder:

* ```systemjs``` uses the [systemjs-builder](https://github.com/systemjs/builder)
* ```jspm``` uses the [included builder](https://github.com/jspm/jspm-cli/blob/master/lib/bundle.js) of [jspm](https://github.com/jspm/jspm-cli)

The default value of this option is ```systemjs```.

**Attention:** When using ```jspm``` as builder, the ```configPath``` option will
be ignored. The builder uses the configured path to the config file inside the
```package.json```. You also should not rewrite the ```baseURL``` property using
the ```config``` option. This value can be defined in the ```package.json``` as
well.

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

### ```pluginPaths```

This is a list of all _plugin_ files. The build of these files will have a
substracted module tree of the _base_ file. The paths will be defined as
```array of strings```.

```javascript
	pluginPaths: [
		'js/src/PluginA.js',
		'anywhere/else/src/PluginB.js'
	]
```

### ```out```

This defines the relative output path for built _base_ and _plugin_ files. The
path is defined relative to each source file (defined by ```basePath``` and
```pluginPaths```). The default value is ```'../build/'```.

```javascript
	out: '../build/'
```

*Example:* When using ```../build/``` as ```out``` option, with
```js/src/Base.js``` being the location of the _base_ file, the build process
will output to ```js/build/Base.js```.
