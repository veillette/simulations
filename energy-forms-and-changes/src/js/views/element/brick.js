import * as PIXI from 'pixi.js';
import BlockView from 'views/element/block';
import Assets from 'assets';
import Constants from 'constants';

/**
 * A view that represents a brick model
 */
var BrickView = BlockView.extend({

    createFrontFace: function(points) {
        return PIXI.createTexturedPolygonFromPoints(points, Assets.Texture(Assets.Images.BRICK_TEXTURE_FRONT));
    },

    createTopFace: function(points) {
        return PIXI.createTexturedPolygonFromPoints(points, Assets.Texture(Assets.Images.BRICK_TEXTURE_TOP));
    },

    createRightFace: function(points) {
        return PIXI.createTexturedPolygonFromPoints(points, Assets.Texture(Assets.Images.BRICK_TEXTURE_RIGHT));
    },

    getColor: function() {
        return BrickView.FILL_COLOR;
    }

}, Constants.BrickView);

export default BrickView;