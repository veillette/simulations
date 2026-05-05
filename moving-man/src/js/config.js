(function () {
    'use strict';

    var config = {
        paths: {
            jquery:     '../../node_modules/jquery/dist/jquery',
            underscore: '../../bower_components/lodash/dist/lodash',
            backbone:   '../../node_modules/backbone/backbone',
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
        }
    };

    require.config(config);
})();