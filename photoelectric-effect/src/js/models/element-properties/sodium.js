import _ from 'underscore';
import DischargeLampElementProperties from 'discharge-lamps/models/element-properties';
import DefaultEnergyEmissionStrategy from 'discharge-lamps/models/default-energy-emission-strategy';
import MetalEnergyAbsorptionStrategy from 'models/metal-energy-absorption-strategy';
import Constants from 'constants';

var TransitionEntry = DischargeLampElementProperties.TransitionEntry;

// Likelihoods of emission transitions from one state to another
var transitionEntries = [
    new TransitionEntry(4, 0, 0.05),
    new TransitionEntry(5, 1, 0.24),
    new TransitionEntry(1, 0, 1.23),
    new TransitionEntry(5, 1, 0.07),
    new TransitionEntry(3, 1, 1.03),
    new TransitionEntry(2, 1, 0.26),
    new TransitionEntry(5, 3, 0.15),
    new TransitionEntry(4, 2, 0.13),
    new TransitionEntry(5, 4, 0.13),
    new TransitionEntry(0, 0, 1)
];

/**
 * Sodium
 */
var Sodium = DischargeLampElementProperties.extend({

    defaults: _.extend({}, DischargeLampElementProperties.prototype.defaults, {
        name: Constants.Sodium.NAME,
        energyAbsorptionStrategy: new MetalEnergyAbsorptionStrategy(Constants.Sodium.WORK_FUNCTION),
        energyEmissionStrategy: new DefaultEnergyEmissionStrategy(),
        workFunction: Constants.Sodium.WORK_FUNCTION,
        energyLevels: Constants.Sodium.ENERGY_LEVELS
    }),

    /**
     *
     */
    initialize: function(attributes, options) {
        options = _.extend({
            transitionEntries: transitionEntries
        }, options);

        DischargeLampElementProperties.prototype.initialize.apply(this, [attributes, options]);
    },

}, Constants.Sodium);

export default Sodium;
