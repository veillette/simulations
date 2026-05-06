import _ from 'underscore';
import FixedIntervalSimulation from 'common/simulation/fixed-interval-simulation';
import Constants from 'constants';

/**
 * Base simulation model for nuclear physics
 */
var NuclearPhysicsSimulation = FixedIntervalSimulation.extend({

    defaults: _.extend({}, FixedIntervalSimulation.prototype.defaults, {

    }),

    initialize: function(attributes, options) {
        options = _.extend({
            framesPerSecond: Constants.FRAME_RATE,
            deltaTimePerFrame: Constants.DELTA_TIME_PER_FRAME
        }, options);

        FixedIntervalSimulation.prototype.initialize.apply(this, [attributes, options]);

    },

    /**
     * Initializes the models used in the simulation
     */
    initComponents: function() {

    }

});

export default NuclearPhysicsSimulation;
