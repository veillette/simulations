import _ from 'underscore';
import Simulation from 'common/simulation/simulation';

/**
 * Wraps the update function in
 */
var NuclearFissionSimulation = Simulation.extend({

    defaults: _.extend(Simulation.prototype.defaults, {

    }),

    initialize: function(attributes, options) {
        Simulation.prototype.initialize.apply(this, [attributes, options]);

    },

    /**
     * Initializes the models used in the simulation
     */
    initComponents: function() {

    },

    _update: function(time, deltaTime) {

    }

});

export default NuclearFissionSimulation;
