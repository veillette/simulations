import _ from 'underscore';
import Propagator from 'models/propagator';

/**
 * Resets particles that have collided.
 */
var CrashPropagator = function() {};

/**
 * Instance functions/properties
 */
_.extend(CrashPropagator.prototype, Propagator.prototype, {

    propagate: function(deltaTime, particle) {
        if (particle.hasCollided()) {
            particle.velocity = 0;
            particle.collided = false;
        }
    }

});

export default CrashPropagator;
