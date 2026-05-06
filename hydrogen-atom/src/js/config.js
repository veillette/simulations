(function () {
    'use strict';

    var config = {
        paths: {
            jquery:     '../../node_modules/jquery/dist/jquery',
            underscore: '../../node_modules/underscore/underscore',
            backbone:   '../../node_modules/backbone/backbone',
            bootstrap:  '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min',
            text:       '../../node_modules/requirejs-text/text',
            pixi:       '../../../common/node_modules/pixi.js/dist/pixi',
            nouislider: '../../bower_components/nouislider/distribute/jquery.nouislider.all.min',
            buzz:       '../../bower_components/buzz/dist/buzz.min',

            'vector2-node':          '../../../common/math/vector2',
            'object-pool':           '../../../common/pool',

            assets:     '../js/assets',
            constants:  '../js/constants',
            common:     '../../../common',

            'views':            '../../../nuclear-physics/src/js/views',
            'models':           '../../../nuclear-physics/src/js/models',
            'templates':        '../../../nuclear-physics/src/templates',
            'styles':           '../../../nuclear-physics/src/styles',
            'nuclear-physics':  '../../../nuclear-physics/src/js',

            'rutherford-scattering/views':        '../../../rutherford-scattering/src/js/views',
            'rutherford-scattering/models':       '../../../rutherford-scattering/src/js/models',
            'rutherford-scattering/templates':    '../../../rutherford-scattering/src/templates',
            'rutherford-scattering/styles':       '../../../rutherford-scattering/src/styles',
            'rutherford-scattering':              '../../../rutherford-scattering/src/js',

            'hydrogen-atom/views':        '../js/views',
            'hydrogen-atom/models':       '../js/models',
            'hydrogen-atom/templates':    '../templates',
            'hydrogen-atom/styles':       '../styles',
            'hydrogen-atom':              '.'
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
            logLevel: 1,
            async: true,

            globalVars: {
                dependencyDir: '"/bower_components"'
            }
        },

        shim: {
            'pixi': {
                exports: 'PIXI'
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