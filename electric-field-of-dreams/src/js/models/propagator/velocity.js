import _ from 'underscore';
import Vector2 from 'common/math/vector2';
import Propagator from 'models/propagator';

/**
 * Keeps a particle within four bounding walls.
 */
var VelocityPropagator = function(maxVelocity) {
    this.maxVelocity = maxVelocity;

    this._vel = new Vector2();
    this._acc = new Vector2();
};

/**
 * Instance functions/properties
 */
_.extend(VelocityPropagator.prototype, Propagator.prototype, {

    propagate: function(deltaTime, particle) {
        var acc = this._acc.set(particle.get('acceleration'));
        var vel = this._vel.set(particle.get('velocity')).add(acc.scale(deltaTime));
        var mag = vel.length();

        if (mag > this.maxVelocity)
            vel.scale(this.maxVelocity / mag);

        particle.setVelocity(vel);
    }

});

export default VelocityPropagator;
