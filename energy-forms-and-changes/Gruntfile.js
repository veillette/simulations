module.exports = function(grunt){

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
            dist: {
                options: {
                    port: '8090',
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
                        jquery:           '../../bower_components/jquery/dist/jquery',
                        underscore:       '../../bower_components/underscore/underscore',
                        backbone:         '../../bower_components/backbone/backbone',
                        bootstrap:        '../../bower_components/bootstrap/dist/js/bootstrap.min',
                        text:             '../../bower_components/requirejs-text/text',
                        pixi:             '../../bower_components/pixi/bin/pixi',
                        nouislider:       '../../bower_components/nouislider/distribute/jquery.nouislider.all.min',
                        'vector2-node':   '../../node_modules/vector2-node-shimmed/index',
                        'object-pool':    '../../node_modules/object-pool-shimmed/index',
                        'circular-list':  '../../node_modules/circular-list-shimmed/index',

                        views:      '../js/views',
                        graphics:   '../js/graphics',
                        assets:     '../js/assets',
                        constants:  '../js/constants',
                        models:     '../js/models',
                        templates:  '../templates',
                        styles:     '../styles',
                        common:     '../../../common'
                    },
                    packages: [{
                        name: 'css',
                        location: '../../bower_components/require-css',
                        main: 'css'
                    }, {
                        name: 'less',
                        location: '../../bower_components/require-less',
                        main: 'less'
                    }],
                    less: {
                        modifyVars: {
                            'fa-font-path': '"../node_modules/font-awesome/fonts/"'
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
