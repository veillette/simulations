import _ from 'underscore';
import Vector2 from 'common/math/vector2';
import BoundsBouncePropagator from 'models/propagator/bounds-bounce';

/**
 *
 */
var WestBouncePropagator = function(xMin, distFromWall) {
    this.xMin = xMin;
    this.distFromWall = distFromWall;

    this._vec = new Vector2();
};

/**
 * Instance functions/properties
 */
_.extend(WestBouncePropagator.prototype, BoundsBouncePropagator.prototype, {

    isOutOfBounds: function(position) {
        return position.x < this.xMin;
    },

    getPointAtBounds: function(oldPosition) {
        return this._vec.set(this.xMin + this.distFromWall, oldPosition.y);
    },

    getNewVelocity: function(oldVelocity) {
        var x = Math.abs(oldVelocity.x);
        return this._vec.set(x, oldVelocity.y);
    }

});

export default WestBouncePropagator;
