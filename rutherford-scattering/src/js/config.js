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

            'point-in-polygon':      '../js/point-in-polygon',
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

            'rutherford-scattering/views':        '../js/views',
            'rutherford-scattering/models':       '../js/models',
            'rutherford-scattering/templates':    '../templates',
            'rutherford-scattering/styles':       '../styles',
            'rutherford-scattering':              '.'
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