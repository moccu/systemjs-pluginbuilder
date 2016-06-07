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
