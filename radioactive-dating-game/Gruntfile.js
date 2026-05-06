module.exports = function(grunt) {

	var fs = require('fs');

	var _               = grunt.util._;
	var requireJsConfig = require('./src/js/config.js');

	var BANNER_TEMPLATE_STRING = '/*! <%= pkg.name %> - v<%= pkg.version %> - '
		+ '<%= grunt.template.today("yyyy-mm-dd") %> */\n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dist: ['dist']
		},
		copy: {
			require: {
				src: 'node_modules/requirejs/require.js',
				dest: 'dist/js/require.js'
			},
			images: {
				expand: true, // required when using cwd
				cwd: 'src/img/',
				src: '**',
				dest: 'dist/img/'
			},
			audio: {
				expand: true, // required when using cwd
				cwd: 'src/audio/',
				src: '**',
				dest: 'dist/audio/'
			},
			nuclear_physics_audio: {
				expand: true, // required when using cwd
				cwd: '../nuclear-physics/src/audio/',
				src: '**',
				dest: 'dist/audio/'
			},
			fonts: {
				expand: true,
				filter: 'isFile',
				flatten: true,
				src: ['../nuclear-physics/node_modules/font-awesome/fonts/**'],
				dest: 'dist/node_modules/font-awesome/fonts/'
			},
			common: {
				src: [
					'../common/**/*.{eot,svg,ttf,woff,otf}',
					'../common/img/**/*.{png,jpg,jpeg,gif}',
					'!../common/**/docs/**/*'
				],
				dest: 'dist/common/'
			},
			nuclear_physics_img: {
				expand: true, // required when using cwd
				cwd: '../nuclear-physics/src/img/',
				src: '**',
				dest: 'dist/img/'
			},
			screenshot: {
				src: 'src/screenshot.png',
				dest: 'dist/screenshot.png'
			}
		},
		connect: {
			dist: {
				options: {
					port: '8090',
					base: 'dist'
				}
			}
		},
		requirejs: {
			compile: {
				options: _.merge(requireJsConfig, {
					baseUrl: 'src/js',
					findNestedDependencies: true,
					optimize: 'uglify2',
					name: 'main',
					out: 'src/optimized.js',

					paths: {
						'assets': 'assets-dist',
						'styles/font-awesome' : '../styles/font-awesome'
					},

					less: {
						modifyVars: {
							'fa-font-path': '"../node_modules/font-awesome/fonts/"',
						}
					}

					// Doing it this way doesn't work:
					// mainConfigFile: 'src/js/config.js'
				})
			}
		},
		uglify: {
			options: {
				banner: BANNER_TEMPLATE_STRING
			},
			dist: {
				files: {
					'dist/scripts/require.js': ['dist/scripts/require.js']
				}
			}
		},
		targethtml: {
			dist: {
				files: {
					'dist/index.html': 'src/index.html'
				}
			}		
		},		
		watch: {
			styles: {
				files: ['src/less/**/*.less'], // files to watch
				tasks: ['less:development'],
				options: {
					nospawn: true
				}
			}
		},
		eslint: {
			options: {
				configType: 'flat'
			},
			source: {
				src: ['src/**/*.js', '!src/js/lib/**/*.js']
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		}
	});

	require('load-grunt-tasks')(grunt);


		// Build the template, replacing {{ test }} with the list of test files
		var template = grunt.file.read(options.template).replace('{{ tests }}', JSON.stringify(tests));

		// Write template to tests directory and run tests
		grunt.file.write(options.runner, template);
	});

	grunt.registerTask('move-optimized', function() {
		fs.renameSync('src/optimized.js', 'dist/js/optimized.js');
	});

	grunt.registerTask('default', [
		'watch'
	]);

	grunt.registerTask('dist', [
		'clean:dist',
		'requirejs:compile',
		'copy',
		'move-optimized',
		'targethtml'
	]);

	grunt.registerTask('test', ['eslint', 'karma']);

	grunt.registerTask('lint', ['eslint']);

};
