import _ from 'underscore';
import Propagator from 'models/propagator';

/**
 * Resets all particle collisions
 */
var ResetElectronPropagator = function() {};

/**
 * Instance functions/properties
 */
_.extend(ResetElectronPropagator.prototype, Propagator.prototype, {

    propagate: function(deltaTime, particle) {
        particle.forgetCollision();
    }

});

export default ResetElectronPropagator;
