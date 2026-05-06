module.exports = function(grunt){

	var fs = require('fs');

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
			fonts: {
				expand: true,
				filter: 'isFile',
				flatten: true,
				src: ['node_modules/font-awesome/fonts/**'],
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
			screenshot: {
				src: 'src/screenshot.png',
				dest: 'dist/screenshot.png'
			}
		},
		connect: {
			src: {
				options: {
					port: 8080,
					base: require('path').resolve('..'),
					keepalive: false,
					open: 'http://localhost:8080/moving-man/src/'
				}
			},
			dist: {
				options: {
					port: 8090,
					base: 'dist'
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: 'src/js',
					mainConfigFile: 'src/js/config.js',
					findNestedDependencies: true,
					optimize: 'uglify2',
					paths: {
						jquery:     '../../bower_components/jquery/dist/jquery',
						underscore: '../../bower_components/lodash/dist/lodash',
						backbone:   '../../bower_components/backbone/backbone',
						bootstrap:  '../../bower_components/bootstrap/dist/js/bootstrap.min',
						text:       '../../bower_components/requirejs-text/text',
						pixi:       '../../bower_components/pixi/bin/pixi',
						nouislider: '../../bower_components/nouislider/distribute/jquery.nouislider.all.min',
						glmatrix:   '../../bower_components/gl-matrix/dist/gl-matrix',
						buzz:       '../../bower_components/buzz/dist/buzz.min',
						fparser:    '../../bower_components/fparser/fparser',

						views:      '../js/views',
						models:     '../js/models',
						templates:  '../templates',
						styles:     '../styles',
						common:     '../../../common',
						less:       '../js/less-shim'
					},
					packages: [{
						name: 'css',
						location: '../../bower_components/require-css',
						main: 'css'
					}],
					shim: {
						fparser: {
							exports: 'Formula'
						}
					},
					name: 'main',
					out: 'src/optimized.js'
				}
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
		less: {
			dev: {
				files: [
					{
						expand: true,
						cwd: 'src/styles',
						src: ['*.less', '!variables.less', '!mixins.less'],
						dest: 'src/styles',
						ext: '.css'
					},
					{
						expand: true,
						cwd: '../common/styles',
						src: ['slider.less', 'radio.less'],
						dest: '../common/styles',
						ext: '.css'
					},
					{
						expand: true,
						cwd: '../common/app',
						src: ['app.less', 'tabs.less'],
						dest: '../common/app',
						ext: '.css'
					},
					{
						expand: true,
						cwd: '../common/graph',
						src: ['graph.less'],
						dest: '../common/graph',
						ext: '.css'
					}
				]
			}
		},
		watch: {
			styles: {
				files: ['src/styles/**/*.less', '../common/styles/*.less'],
				tasks: ['less:dev'],
				options: {
					nospawn: true
				}
			}
		},
		eslint: {
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

	grunt.registerTask('move-optimized', function() {
		fs.renameSync('src/optimized.js', 'dist/js/optimized.js');
	});

	grunt.registerTask('default', [
		'watch'
	]);

	grunt.registerTask('serve', [
		'less:dev',
		'connect:src',
		'watch'
	]);

	grunt.registerTask('dist', [
		'clean:dist',
		'less:dev',
		'requirejs:compile',
		'copy',
		'move-optimized',
		'targethtml'
	]);

	grunt.registerTask('test', ['eslint', 'karma']);

	grunt.registerTask('lint', ['eslint']);

};
