import RutherfordScatteringSimulation from 'rutherford-scattering/models/simulation';
import AlphaParticles from 'rutherford-scattering/collections/alpha-particles';
import Constants from 'constants';

/**
 * Wraps the update function in
 */
var PlumPuddingSimulation = RutherfordScatteringSimulation.extend({

    initialize: function(attributes, options) {
        this.boundWidth = Constants.PUDDING_ACTUAL;
        RutherfordScatteringSimulation.prototype.initialize.apply(this, arguments);
    },

    initParticles: function() {
        this.alphaParticles = new AlphaParticles(null, {bounds: this.bounds});
    }

});

export default PlumPuddingSimulation;
