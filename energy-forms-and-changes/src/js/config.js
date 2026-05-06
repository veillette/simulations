(function () {
    'use strict';

    var config = {
        paths: {
            jquery:           '../../node_modules/jquery/dist/jquery',
            underscore:       '../../node_modules/underscore/underscore',
            backbone:         '../../node_modules/backbone/backbone',
            bootstrap:        '../../node_modules/bootstrap/dist/js/bootstrap.min',
            text:             '../../node_modules/requirejs-text/text',
            pixi:             '../../bower_components/pixi/bin/pixi',
            nouislider:       '../../bower_components/nouislider/distribute/jquery.nouislider.all.min',
            'vector2-node':   '../../../common/math/vector2',
            'object-pool':    '../../../common/pool',

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
        }
    };

    require.config(config);
})();