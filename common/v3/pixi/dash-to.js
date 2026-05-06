define(function(require) {

    'use strict';

    var PIXI = require('pixi');

    if (!PIXI.Graphics.prototype.__dashToPatched) {
        var originalMoveTo = PIXI.Graphics.prototype.moveTo;
        var originalLineTo = PIXI.Graphics.prototype.lineTo;

        PIXI.Graphics.prototype.moveTo = function(x, y) {
            this.__dashCurrentPoint = { x: x, y: y };
            return originalMoveTo.call(this, x, y);
        };

        PIXI.Graphics.prototype.lineTo = function(x, y) {
            this.__dashCurrentPoint = { x: x, y: y };
            return originalLineTo.call(this, x, y);
        };

        PIXI.Graphics.prototype.__dashToPatched = true;
    }

    /**
     * Works the same as the lineTo function but draws a dashed line. Each
     *   number in the dashStyle array corresponds to either a solid or
     *   blank length.
     * 
     * Used this as a starting point: http://stackoverflow.com/a/15968095
     */
    PIXI.Graphics.prototype.dashTo = function(x, y, dashStyle) {
        var current = this.__dashCurrentPoint;
        if (!current) {
            this.moveTo(x, y);
            return;
        }

        var x0 = current.x;
        var y0 = current.y;

        if (dashStyle === undefined) {
            if (!this._dashStyle)
                this._dashStyle = [ 10, 10 ];
            dashStyle = this._dashStyle;
        }

        if (dashStyle.length % 2 !== 0) {
            console.warn('Dash style array must include an even number of entries. Padding with a space.');
            dashStyle.push(4);
        }

        var dX = x - x0;
        var dY = y - y0;
        var lineLength = Math.sqrt(dX * dX + dY * dY);
        var unitX = dX / lineLength;
        var unitY = dY / lineLength;

        var lengthDrawn = 0;
        var i = 0;
        var lengthToDraw;
        while (lengthDrawn < lineLength) {
            lengthToDraw = dashStyle[i % dashStyle.length];
            if (lengthToDraw + lengthDrawn > lineLength)
                lengthToDraw = lineLength - lengthDrawn;
            x0 += unitX * lengthToDraw;
            y0 += unitY * lengthToDraw;
            this[i % dashStyle.length === 0 ? 'lineTo' : 'moveTo'](x0, y0);
            lengthDrawn += lengthToDraw;
            i++;
        }
        this[i % dashStyle.length === 0 ? 'lineTo' : 'moveTo'](x, y);
        this.__dashCurrentPoint = { x: x, y: y };
    };

    return PIXI;
});