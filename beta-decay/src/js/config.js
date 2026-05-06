(function () {
    'use strict';

    var config = {
        paths: {
            jquery:       '../../../nuclear-physics/node_modules/jquery/dist/jquery',
            underscore:   '../../../nuclear-physics/node_modules/underscore/underscore',
            backbone:     '../../../nuclear-physics/node_modules/backbone/backbone',
            bootstrap:    '../../../nuclear-physics/bower_components/bootstrap/dist/js/bootstrap.min',
            text:         '../../../nuclear-physics/bower_components/requirejs-text/text',
            pixi:         '../../../nuclear-physics/node_modules/pixi.js/dist/pixi',
            nouislider:   '../../../nuclear-physics/bower_components/nouislider/distribute/jquery.nouislider.all.min',
            buzz:         '../../../nuclear-physics/bower_components/buzz/dist/buzz.min',

            'vector2-node':          '../../../common/math/vector2',
            'object-pool':           '../../../common/pool',
            'bootstrap-select':      '../../../nuclear-physics/node_modules/bootstrap-select/js/bootstrap-select',
            'bootstrap-select-less': '../../../nuclear-physics/node_modules/bootstrap-select/less/bootstrap-select',

            views:                  '../../../nuclear-physics/src/js/views',
            models:                 '../../../nuclear-physics/src/js/models',
            assets:                 '../js/assets',
            constants:              '../js/constants',
            templates:              '../../../nuclear-physics/src/templates',
            styles:                 '../../../nuclear-physics/src/styles',
            common:                 '../../../common',
            'nuclear-physics':      '../../../nuclear-physics/src/js/',
            'beta-decay':           '.',
            'beta-decay/templates': '../templates',
            'beta-decay/styles':    '../styles'
        },

        packages: [{
            name: 'css',
            location: '../../../nuclear-physics/bower_components/require-css',
            main: 'css'
        }, {
            name: 'less',
            location: '../../../nuclear-physics/bower_components/require-less',
            main: 'less'
        }],

        less: {
            logLevel: 1,
            async: true,

            globalVars: {
                dependencyDir: '"../nuclear-physics/bower_components"'
            }
        },

        shim: {
            'pixi': {
                exports: 'PIXI'
            },
            'bootstrap-select': {
                deps: ['jquery']
            }
        },
    };

    // Dual export: CJS for Gruntfile (Node), RequireJS config for browser AMD loader.
    // ESM migration: replace this block with `export default config;` and update
    // main.js to use static `import` instead of `require(['config'], ...)`.
    if (typeof module !== 'undefined') {
        module.exports = config;
    } else if (typeof require !== 'undefined' && require.config) {
        require.config(config);
    }
})();