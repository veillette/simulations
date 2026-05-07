import _ from 'underscore';
import Propagator from 'models/propagator';

/**
 * Keeps a particle within four bounding walls.
 */
var PositionPropagator = function() {};

/**
 * Instance functions/properties
 */
_.extend(PositionPropagator.prototype, Propagator.prototype, {

    propagate: function(deltaTime, particle) {
        particle.updatePositionFromVelocity(deltaTime);
    }

});

export default PositionPropagator;
