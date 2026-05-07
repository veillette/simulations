import _ from 'underscore';
import Law from 'models/law';

/**
 *
 */
var PropagatorLawAdapter = function(propagator) {
    this.propagator = propagator;
};

/**
 * Instance functions/properties
 */
_.extend(PropagatorLawAdapter.prototype, Law.prototype, {

    update: function(deltaTime, system) {
        this.propagator.update(deltaTime, system);
    }

});

export default PropagatorLawAdapter;
