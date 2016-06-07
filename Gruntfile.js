var
	FILES_TO_VALIDATE = [
		'lib/**/*.js',
		'tests/**/tests*.js',
		'tests/**/fixtures/**/*.js',
		'example/src/**/*.js',
		'example/*.js',
		'Gruntfile.js',

		// Excludes:
		'!**/build/**/*.js'
	],
	FILES_TO_TEST = [
		'tests/**/tests*.js'
	]
;


module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-lintspaces');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			source: {
				src: FILES_TO_VALIDATE,
				options: {
					jshintrc: '.jshintrc'
				}
			}
		},

		jscs: {
			source: {
				src: FILES_TO_VALIDATE,
				options: {
					config: '.jscs.json'
				}
			}
		},

		lintspaces: {
			source: {
				src: FILES_TO_VALIDATE,
				options: {
					rcconfig: '.lintspacesrc'
				}
			}
		},

		nodeunit: {
			source: {
				src: FILES_TO_TEST
			},
			readme: {
				src: 'docs/**/*.md'
			}
		},

		concat: {
			readme: {
				src: [
					'docs/intro.md',
					'docs/installation.md',
					'docs/options.md',
					'docs/functions.md',
					'docs/examples.md',
					'docs/contribution.md',
					'docs/license.md'
				],
				dest: 'README.md'
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

	grunt.registerTask(
		'build',
		'Build readme file',
		[
			'concat:readme'
		]
	);

	grunt.registerTask(
		'default',
		[
			'validate',
			'test',
			'build'
		]
	);

};
