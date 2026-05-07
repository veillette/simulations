import * as PIXI from 'pixi.js';
import Colors from 'common/colors/colors';
import Constants from 'constants';
var NORTH_COLOR = Colors.parseHex(Constants.NORTH_COLOR);
var SOUTH_COLOR = Colors.parseHex(Constants.SOUTH_COLOR);

var cache = {};
var textureFromCanvas = function(canvas) {
    if (PIXI.Texture.from)
        return PIXI.Texture.from(canvas);
    return PIXI.Texture.fromCanvas(canvas);
};
var hexIntegerToCss = function(value) {
    var hex = value.toString(16);
    while (hex.length < 6)
        hex = '0' + hex;
    return '#' + hex;
};

var CompassNeedleTexture = {

    /**
     * Creates a new compass needle texture with the specified width and returns it.
     */
    create: function(width) {
        width = Math.round(width);

        // If we've already drawn a texture this size, return that instead
        if (cache[width] !== undefined)
            return cache[width];

        // Draw a new one
        var height = Math.round((15 / 55) * width);
        var halfHeight = height / 2;
        var halfWidth = width / 2;

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');

        var centerX = halfWidth;
        var centerY = halfHeight;
        var northHex = hexIntegerToCss(NORTH_COLOR);
        var southHex = hexIntegerToCss(SOUTH_COLOR);

        ctx.fillStyle = northHex;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + halfHeight);
        ctx.lineTo(centerX + halfWidth, centerY);
        ctx.lineTo(centerX, centerY - halfHeight);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = southHex;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + halfHeight);
        ctx.lineTo(centerX - halfWidth, centerY);
        ctx.lineTo(centerX, centerY - halfHeight);
        ctx.closePath();
        ctx.fill();

        var texture = textureFromCanvas(canvas);
        cache[width] = texture;

        return texture;
    },

    /**
     * Removes the specified texture from the texture cache.  Returns true
     *   if the texture was found and removed from the cache.
     */
    remove: function(texture) {
        for (var key in cache) {
            if (cache[key] === texture) {
                delete cache[key];
                return true;
            }
        }

        return false;
    }

};

export default CompassNeedleTexture;