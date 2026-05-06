(function () {
    'use strict';

    var config = {
        paths: {
            jquery:     '../../node_modules/jquery/dist/jquery',
            underscore: '../../node_modules/underscore/underscore',
            underscoreDeepExtend: '../../bower_components/underscore-deep-extend/index',
            backbone:   '../../node_modules/backbone/backbone',
            bootstrap:  '../../bower_components/bootstrap/dist/js/bootstrap.min',
            text:       '../../bower_components/requirejs-text/text',
            pixi:       '../../bower_components/pixi/bin/pixi',
            nouislider: '../../bower_components/nouislider/distribute/jquery.nouislider.all.min',
            buzz:       '../../bower_components/buzz/dist/buzz.min',
            'vector2-node':   '../../../common/math/vector2',
            'object-pool':    '../../../common/pool',
            'bootstrap-select':      '../../node_modules/bootstrap-select/js/bootstrap-select',
            'bootstrap-select-less': '../../node_modules/bootstrap-select/less/bootstrap-select',

            views:      '../js/views',
            models:     '../js/models',
            assets:     '../js/assets',
            constants:  '../js/constants',
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
            logLevel: 1,
            async: true,

            globalVars: {
                dependencyDir: '"/bower_components"'
            }
        },

        shim: {
            'bootstrap-select': {
                deps: ['jquery']
            }
        },
    };

    // Expose to the rest of the world 
    if (typeof module !== 'undefined') { 
        module.exports = config; // For nodejs 
    } 
    else if (typeof require.config !== 'undefined') { 
        require.config(config); // For requirejs 
    }
})();