import _ from 'underscore';
import Vector2 from 'common/math/vector2';
import BoundsBouncePropagator from 'models/propagator/bounds-bounce';

/**
 *
 */
var SouthBouncePropagator = function(yMax, distFromWall) {
    this.yMax = yMax;
    this.distFromWall = distFromWall;

    this._vec = new Vector2();
};

/**
 * Instance functions/properties
 */
_.extend(SouthBouncePropagator.prototype, BoundsBouncePropagator.prototype, {

    isOutOfBounds: function(position) {
        return position.y > this.yMax;
    },

    getPointAtBounds: function(oldPosition) {
        return this._vec.set(oldPosition.x, this.yMax - this.distFromWall);
    },

    getNewVelocity: function(oldVelocity) {
        var y = -Math.abs(oldVelocity.y);
        return this._vec.set(oldVelocity.x, y);
    }

});

export default SouthBouncePropagator;
