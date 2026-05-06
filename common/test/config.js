(function () {
    'use strict';

    var config = {
        paths: {
            jquery:           './node_modules/jquery/dist/jquery',
            underscore:       './node_modules/underscore/underscore',
            backbone:         './node_modules/backbone/backbone',
            bootstrap:        './node_modules/bootstrap/dist/js/bootstrap.min',
            text:             './node_modules/requirejs-text/text',
            pixi:             './node_modules/pixi/bin/pixi.dev',
            'vector2-node':   './math/vector2',
            'object-pool':    './pool',
        }
    };

    require.config(config);
})();