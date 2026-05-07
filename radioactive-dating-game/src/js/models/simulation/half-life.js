import _ from 'underscore';
import MultiNucleusDecaySimulation from 'models/simulation/multi-nucleus-decay';
import NucleusType from 'models/nucleus-type';
import Carbon14Nucleus from 'models/nucleus/carbon-14';
import Uranium238Nucleus from 'models/nucleus/uranium-238';
import HeavyAdjustableHalfLifeNucleus from 'models/nucleus/heavy-adjustable-half-life';
import Constants from 'constants';

/**
 * Simulation model for multi-nucleus radioactive-dating-game simulation
 */
var HalfLifeSimulation = MultiNucleusDecaySimulation.extend({

    defaults: _.extend({}, MultiNucleusDecaySimulation.prototype.defaults, {
        nucleusType: Constants.HalfLifeSimulation.DEFAULT_NUCLEUS_TYPE,
        maxNuclei:   Constants.HalfLifeSimulation.MAX_NUCLEI,
        jitterEnabled: true
    }),

    /**
     * Initializes the models used in the simulation
     */
    initComponents: function() {
        this._newCarbonNucleusOptions = _.extend({}, this._newNucleusOptions, {
            enlarged: true
        });

        MultiNucleusDecaySimulation.prototype.initComponents.apply(this, arguments);
    },

    /**
     * Resets the model components
     */
    resetComponents: function() {
        MultiNucleusDecaySimulation.prototype.resetComponents.apply(this, arguments);
    },

    /**
     * Runs every frame of the simulation loop.
     */
    _update: function(time, deltaTime) {
        MultiNucleusDecaySimulation.prototype._update.apply(this, arguments);
    },

    /**
     * Creates and returns a nucleus of the current type
     */
    createNucleus: function() {
        switch (this.get('nucleusType')) {
            case NucleusType.CARBON_14:    return Carbon14Nucleus.create(this._newCarbonNucleusOptions);
            case NucleusType.URANIUM_238:  return Uranium238Nucleus.create(this._newNucleusOptions);
            case NucleusType.HEAVY_CUSTOM: return HeavyAdjustableHalfLifeNucleus.create(this._newNucleusOptions);
        }

        throw 'Other nuclei not yet implemented.';
    },

    triggerNucleusChange: function(nucleus, byProducts) {
        this.trigger('nucleus-change', nucleus, byProducts);
    },

    removeAllNuclei: function() {
        MultiNucleusDecaySimulation.prototype.removeAllNuclei.apply(this, arguments);
    }

}, Constants.HalfLifeSimulation);

export default HalfLifeSimulation;
