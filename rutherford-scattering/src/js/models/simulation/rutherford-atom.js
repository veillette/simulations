import RutherfordScatteringSimulation from 'rutherford-scattering/models/simulation';
import RutherfordParticles from 'rutherford-scattering/collections/rutherford-particles';
import Atom from '../atom';
import Constants from 'constants';

/**
 * Wraps the update function in
 */
var RutherfordAtomSimulation = RutherfordScatteringSimulation.extend({

    initialize: function(attributes, options) {
        this.boundWidth = Constants.RUTHERFORD_ACTUAL;
        RutherfordScatteringSimulation.prototype.initialize.apply(this, arguments);

        this.on('change:protonCount change:neutronCount', this.atomNode.updateRadius.bind(this.atomNode))
    },

    initComponents: function(){
        RutherfordScatteringSimulation.prototype.initComponents.apply(this, arguments);
        this.atomNode = new Atom(null, {simulation: this});
    },

    initParticles: function() {
        this.alphaParticles = new RutherfordParticles(null, {bounds: this.bounds});
    },

    pauseAtomDraw: function() {
        this.atomNode.set('hold', true);
    },

    restartAtomDraw: function() {
        this.atomNode.set('hold', false);
    }

});

export default RutherfordAtomSimulation;
