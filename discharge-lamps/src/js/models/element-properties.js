import _ from 'underscore';
import ElementProperties from 'common/quantum/models/element-properties';
import LevelSpecificEnergyEmissionStrategy from './level-specific-energy-emission-strategy';
import EqualLikelihoodAbsorptionStrategy from './equal-likelihood-absorption-strategy';
import DischargeLampAtom from './atom';

/**
 * A place to store element properties
 */
var DischargeLampElementProperties = ElementProperties.extend({

    defaults: _.extend({}, ElementProperties.prototype.defaults, {
        energyAbsorptionStrategy: null,
        meanStateLifetime: DischargeLampAtom.DEFAULT_STATE_LIFETIME
    }),

    /**
     *
     */
    initialize: function(attributes, options) {
        options = _.extend({
            transitionEntries: []
        }, options);

        ElementProperties.prototype.initialize.apply(this, [attributes, options]);

        var emissionStrategy = new LevelSpecificEnergyEmissionStrategy(options.transitionEntries);
        emissionStrategy.setStates(this.getStates());

        if (!this.get('energyEmissionStrategy'))
            this.set('energyEmissionStrategy', emissionStrategy);
        if (!this.get('energyAbsorptionStrategy'))
            this.set('energyAbsorptionStrategy', new EqualLikelihoodAbsorptionStrategy());
    },

    getEnergyAbsorptionStrategy: function() {
        return this.get('energyAbsorptionStrategy');
    },

    setEnergyAbsorptionStrategy: function(energyAbsorptionStrategy) {
        this.set('energyAbsorptionStrategy', energyAbsorptionStrategy);
    }

});


DischargeLampElementProperties.TransitionEntry = function(sourceStateIndex, targetStateIndex, txStrength) {
    this.sourceStateIndex = sourceStateIndex;
    this.targetStateIndex = targetStateIndex;
    this.txStrength = txStrength;
};


export default DischargeLampElementProperties;
