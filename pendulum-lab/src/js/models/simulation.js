import Simulation from 'common/simulation/simulation';

/**
 * Constants
 */

/**
 * The simulation model
 */
var PendulumLabSimulation = Simulation.extend({

    defaults: {
        units : {
            time : 'sec'
        }
    },

    initialize: function(attributes, options) {
        Simulation.prototype.initialize.apply(this, [attributes, options]);

        this.initComponents();
    },

    /**
     * Initializes the models used in the simulation
     */
    initComponents: function() {


    },

    _update: function(time, deltaTime) {

    }

});

export default PendulumLabSimulation;
