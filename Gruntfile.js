var
	FILES_TO_VALIDATE = [
		'lib/**/*.js',
		'tests/**/*.js',
		'example/**/*.js',
		'Gruntfile.js',

		// Exclude:
		'!**/node_modules/**',
		'!**/jspm_packages/**',
		'!**/build/**',
		'!**/config.js'
	],
	FILES_TO_TEST = [
		'tests/tests*.js'
	]
;


module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-lintspaces');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: {
				src: FILES_TO_VALIDATE,
				options: {
					jshintrc: '.jshintrc'
				}
			}
		},

		jscs: {
			all: {
				src: FILES_TO_VALIDATE,
				options: {
					config: '.jscs.json'
				}
			}
		},

		lintspaces: {
			all: {
				src: FILES_TO_VALIDATE,
				options: {
					rcconfig: '.lintspacesrc'
				}
			}
		},

		nodeunit: {
			all: {
				src: FILES_TO_TEST
			}
		}
	});

	grunt.registerTask(
		'validate',
		'Validate all files.',
		[
			'jshint',
			'jscs',
			'lintspaces'
		]
	);

	grunt.registerTask(
		'test',
		'Run JavaScript tests.',
		[
			'nodeunit'
		]
	);

};
