import Backbone from 'backbone';
import Rectangle from 'common/math/rectangle';
import Constants from 'constants';
var EPSILON = 0.0001; // A tolerance level for determining matching y values

/**
 * A movable target object that detects collisions with projectiles
 */
var Target = Backbone.Model.extend({

    defaults: {
        x: Constants.Target.DEFAULT_X,
        y: Constants.GROUND_Y,
        radius: Constants.Target.DEFAULT_RADIUS,
        collisionEnabled: true
    },

    initialize: function(attributes, options) {
        this._bounds = new Rectangle();

        this.on('change:radius change:x change:y', this.updateBounds);
        this.updateBounds();
    },

    updateBounds: function() {
        this._bounds.set(
            this.get('x') - this.get('radius'),
            this.get('y') + EPSILON,
            this.get('radius') * 2,
            EPSILON
        );
    },

    calculateCollision: function(projectile) {
        var collision = this._bounds.overlaps(projectile.bounds());
        if (collision) {
            this.trigger('collide', this, projectile);
            this.set('collisionEnabled', false);
        }
        return collision;
    },

    reset: function() {
        this.set('collisionEnabled', true);
    },

}, Constants.Target);

export default Target;
