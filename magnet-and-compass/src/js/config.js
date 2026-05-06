(function () {
    'use strict';

    var config = {
        paths: {
            jquery:     '../../../faraday/node_modules/jquery/dist/jquery',
            underscore: '../../../faraday/node_modules/underscore/underscore',
            backbone:   '../../../faraday/node_modules/backbone/backbone',
            bootstrap:  '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min',
            text:       '../../../faraday/bower_components/requirejs-text/text',
            pixi:       '../../../common/node_modules/pixi.js/dist/pixi',
            nouislider: '../../../faraday/bower_components/nouislider/distribute/jquery.nouislider.all.min',
            buzz:       '../../../faraday/bower_components/buzz/dist/buzz.min',

            'vector2-node':          '../../../common/math/vector2',
            'object-pool':           '../../../common/pool',

            local:            './',
            views:            '../../../faraday/src/js/views',
            models:           '../../../faraday/src/js/models',
            assets:           '../js/assets',
            'faraday-assets': '../../../faraday/src/js/assets',
            constants:        '../../../faraday/src/js/constants',
            templates:        '../../../faraday/src/templates',
            styles:           '../../../faraday/src/styles',
            common:           '../../../common'
        },

        packages: [{
            name: 'css',
            location: '../../../faraday/bower_components/require-css',
            main: 'css'
        }, {
            name: 'less',
            location: '../../../faraday/bower_components/require-less',
            main: 'less'
        }],

        less: {
            logLevel: 1,
            async: true,

            globalVars: {
                dependencyDir: '"../faraday/bower_components"'
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