define(function(require) {

    'use strict';

    var _    = require('underscore');
    var PIXI = require('pixi');

    // Pixi v3 fallback path still relies on stage.generateTexture(renderer).
    var stage = new PIXI.Container();
    var wrapper = new PIXI.Container();
    var graphics = new PIXI.Graphics();
    stage.addChild(wrapper);
    stage.addChild(graphics);

    /**
     * Static functions
     */
    var PixiToTexture = {

        displayObjectToTexture: function(displayObject, renderer) {
            wrapper.addChild(displayObject);
            var texture;

            if (renderer && renderer.generateTexture) {
                var bounds = wrapper.getLocalBounds ? wrapper.getLocalBounds() : wrapper.getBounds();
                texture = renderer.generateTexture(
                    wrapper,
                    PIXI.SCALE_MODES ? PIXI.SCALE_MODES.LINEAR : undefined,
                    1,
                    bounds
                );
            } else if (wrapper.generateCanvasTexture) {
                // Modern Pixi versions remove Container#generateTexture, but still
                // expose canvas texture generation on DisplayObject.
                texture = wrapper.generateCanvasTexture();
            } else {
                graphics.clear();
                graphics.beginFill(0, 0);
                graphics.drawRect(0, 0, Math.ceil(wrapper.width), Math.ceil(wrapper.height));
                graphics.endFill();

                var oldBounds = wrapper.getBounds();
                graphics.x = oldBounds.x - (Math.ceil(wrapper.width) - wrapper.width) / 2;
                graphics.y = oldBounds.y - (Math.ceil(wrapper.height) - wrapper.height) / 2;
                if (stage.generateTexture) {
                    texture = stage.generateTexture(renderer);
                } else {
                    throw new Error('PixiToTexture.displayObjectToTexture requires a renderer or canvas texture support');
                }
            }

            wrapper.removeChild(displayObject);

            return texture;
        },


    };


    return PixiToTexture;
});