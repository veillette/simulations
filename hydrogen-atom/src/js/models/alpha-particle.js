import Vector2 from 'common/math/vector2';
import MovingObject from 'hydrogen-atom/models/moving-object';

/**
 * AlphaParticle is the model of an alpha particle.
 * An alpha particle has a position and direction of motion.
 */
var AlphaParticle = MovingObject.extend({

    initialize: function(attributes, options) {
        MovingObject.prototype.initialize.apply(this, [attributes, options]);

        this.initialPosition = new Vector2(this.get('position'));
        this.initialSpeed = this.get('speed');
    },

    getInitialPosition: function() {
        return this.initialPosition;
    },

    getInitialSpeed: function() {
        return this.initialSpeed;
    },

    update: function(time, deltaTime) {}

});

export default AlphaParticle;