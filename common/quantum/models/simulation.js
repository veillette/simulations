import _ from 'underscore';
import FixedIntervalSimulation from 'common/simulation/fixed-interval-simulation';

/**
 * Base simulation model for quantum physics simulations
 */
var QuantumSimulation = FixedIntervalSimulation.extend({

    defaults: _.extend(FixedIntervalSimulation.prototype.defaults, {
        photonSpeedScale: 1,
        elementProperties: undefined
    }),

    getGroundState: function() {
        return this.get('elementProperties').getGroundState();
    },

    getCurrentElementProperties: function() {
        return this.get('elementProperties');
    },

    setCurrentElementProperties: function(elementProperties) {
        this.set('elementProperties', elementProperties);
    }

});

export default QuantumSimulation;
