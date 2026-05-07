import _ from 'underscore';
import Vector2 from 'common/math/vector2';
import BoundsBouncePropagator from 'models/propagator/bounds-bounce';

/**
 *
 */
var NorthBouncePropagator = function(yMin, distFromWall) {
    this.yMin = yMin;
    this.distFromWall = distFromWall;

    this._vec = new Vector2();
};

/**
 * Instance functions/properties
 */
_.extend(NorthBouncePropagator.prototype, BoundsBouncePropagator.prototype, {

    isOutOfBounds: function(position) {
        return position.y < this.yMin;
    },

    getPointAtBounds: function(oldPosition) {
        return this._vec.set(oldPosition.x, this.yMin + this.distFromWall);
    },

    getNewVelocity: function(oldVelocity) {
        var y = Math.abs(oldVelocity.y);
        return this._vec.set(oldVelocity.x, y);
    }

});

export default NorthBouncePropagator;
