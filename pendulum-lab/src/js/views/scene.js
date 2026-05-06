define(function(require) {

    'use strict';

    // Third-party dependencies
    var PIXI = require('pixi');

    // Common dependencies
    var Vector2            = require('common/math/vector2');
    var ModelViewTransform = require('common/math/model-view-transform');
    var PixiSceneView      = require('common/v3/pixi/view/scene');

    // Project dependencies

    // Constants

    // CSS
    require('less!styles/scene');

    /**
     *
     */
    var PendulumLabSceneView = PixiSceneView.extend({

        events: {

        },

        initialize: function(options) {
            PixiSceneView.prototype.initialize.apply(this, arguments);

            this.zoomScale = 1;
        },

        renderContent: function() {

        },

        initGraphics: function() {
            PixiSceneView.prototype.initGraphics.apply(this, arguments);

            this.viewOriginX = Math.round(this.width  / 2);
            this.viewOriginY = Math.round(this.height / 2);
            this.mvt = ModelViewTransform.createSinglePointScaleInvertedYMapping(
                new Vector2(0, 0),
                new Vector2(this.viewOriginX, this.viewOriginY),
                this.zoomScale
            );

            this.initLayers();
        },

        initLayers: function() {
            this.toolsLayer  = new PIXI.Container();
            this.bodyLayer   = new PIXI.Container();
            this.springLayer = new PIXI.Container();

            this.stage.addChild(this.toolsLayer);
            this.stage.addChild(this.bodyLayer);
            this.stage.addChild(this.springLayer);
        },

        _update: function(time, deltaTime, paused, timeScale) {

        },

        setVolume: function(volume) {

        }

    });

    return PendulumLabSceneView;
});
