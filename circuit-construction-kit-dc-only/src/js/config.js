(function () {
    'use strict';

    var config = {
        paths: {
            jquery:       '../../../circuit-construction-kit/node_modules/jquery/dist/jquery',
            underscore:   '../../../circuit-construction-kit/node_modules/underscore/underscore',
            backbone:     '../../../circuit-construction-kit/node_modules/backbone/backbone',
            bootstrap:  '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min',
            text:         '../../../circuit-construction-kit/bower_components/requirejs-text/text',
            pixi:         '../../../common/node_modules/pixi.js/dist/pixi',
            nouislider:   '../../../circuit-construction-kit/bower_components/nouislider/distribute/jquery.nouislider.all.min',
            'file-saver': '../../../circuit-construction-kit/bower_components/file-saver/dist/FileSaver',

            'vector2-node':          '../../../common/math/vector2',
            'object-pool':           '../../../common/pool',
            'sat':                   '../../../circuit-construction-kit/node_modules/sat/SAT',

            local:            './',
            views:            '../../../circuit-construction-kit/src/js/views',
            models:           '../../../circuit-construction-kit/src/js/models',
            persistence:      '../../../circuit-construction-kit/src/js/persistence',
            assets:           '../js/assets',
            'circuit-construction-kit-assets': '../../../circuit-construction-kit/src/js/assets',
            constants:        '../../../circuit-construction-kit/src/js/constants',
            templates:        '../../../circuit-construction-kit/src/templates',
            styles:           '../../../circuit-construction-kit/src/styles',
            common:           '../../../common'
        },

        packages: [{
            name: 'css',
            location: '../../../circuit-construction-kit/bower_components/require-css',
            main: 'css'
        }, {
            name: 'less',
            location: '../../../circuit-construction-kit/bower_components/require-less',
            main: 'less'
        }],

        less: {
            logLevel: 1,
            async: true,

            globalVars: {
                dependencyDir: '"../circuit-construction-kit/bower_components"'
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