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
