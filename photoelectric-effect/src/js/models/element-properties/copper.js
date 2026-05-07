import _ from 'underscore';
import DischargeLampElementProperties from 'discharge-lamps/models/element-properties';
import DefaultEnergyEmissionStrategy from 'discharge-lamps/models/default-energy-emission-strategy';
import MetalEnergyAbsorptionStrategy from 'models/metal-energy-absorption-strategy';
import Constants from 'constants';

/**
 * Copper
 */
var Copper = DischargeLampElementProperties.extend({

    defaults: _.extend({}, DischargeLampElementProperties.prototype.defaults, {
        name: Constants.Copper.NAME,
        energyAbsorptionStrategy: new MetalEnergyAbsorptionStrategy(Constants.Copper.WORK_FUNCTION),
        energyEmissionStrategy: new DefaultEnergyEmissionStrategy(),
        workFunction: Constants.Copper.WORK_FUNCTION,
        energyLevels: Constants.Copper.ENERGY_LEVELS
    })

}, Constants.Copper);

export default Copper;
