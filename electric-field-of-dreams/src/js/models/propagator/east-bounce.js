import _ from 'underscore';
import Vector2 from 'common/math/vector2';
import BoundsBouncePropagator from 'models/propagator/bounds-bounce';

/**
 *
 */
var EastBouncePropagator = function(xMax, distFromWall) {
    this.xMax = xMax;
    this.distFromWall = distFromWall;

    this._vec = new Vector2();
};

/**
 * Instance functions/properties
 */
_.extend(EastBouncePropagator.prototype, BoundsBouncePropagator.prototype, {

    isOutOfBounds: function(position) {
        return position.x > this.xMax;
    },

    getPointAtBounds: function(oldPosition) {
        // TODO: See if this is a mistake in the original. I think it's supposed to be this.xMax - this.distFromWall
        return this._vec.set(this.xMax - this.distFromWall, oldPosition.y);
    },

    getNewVelocity: function(oldVelocity) {
        var x = -Math.abs(oldVelocity.x);
        return this._vec.set(x - this.distFromWall, oldVelocity.y);
    }

});

export default EastBouncePropagator;
