define(function(require) {

    'use strict';


    var PixiSceneView = require('common/v3/pixi/view/scene');


    // Constants

    // CSS
    require('less!styles/scene');

    /**
     *
     */
    var DischargeLampsSceneView = PixiSceneView.extend({

        events: {

        },

        initialize: function(options) {
            PixiSceneView.prototype.initialize.apply(this, arguments);
        },

        renderContent: function() {

        },

        initGraphics: function() {
            PixiSceneView.prototype.initGraphics.apply(this, arguments);
        },

        _update: function(time, deltaTime, paused, timeScale) {

        },

    });

    return DischargeLampsSceneView;
});
