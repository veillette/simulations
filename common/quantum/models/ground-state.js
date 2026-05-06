import _ from 'underscore';
import AtomicState from './atomic-state';

/**
 * The ground state for an atom
 */
var GroundState = AtomicState.extend({

    defaults: _.extend({}, AtomicState.prototype.defaults, {
        energyLevel: 0,
        meanLifetime: Number.POSITIVE_INFINITY
    }),

    getNextLowerEnergyState: function() {
        return AtomicState.MinEnergyState.instance();
    }

});


export default GroundState;
