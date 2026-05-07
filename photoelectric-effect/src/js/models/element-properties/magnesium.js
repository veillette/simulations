import _ from 'underscore';
import DischargeLampElementProperties from 'discharge-lamps/models/element-properties';
import DefaultEnergyEmissionStrategy from 'discharge-lamps/models/default-energy-emission-strategy';
import MetalEnergyAbsorptionStrategy from 'models/metal-energy-absorption-strategy';
import Constants from 'constants';

/**
 * Magnesium
 */
var Magnesium = DischargeLampElementProperties.extend({

    defaults: _.extend({}, DischargeLampElementProperties.prototype.defaults, {
        name: Constants.Magnesium.NAME,
        energyAbsorptionStrategy: new MetalEnergyAbsorptionStrategy(Constants.Magnesium.WORK_FUNCTION),
        energyEmissionStrategy: new DefaultEnergyEmissionStrategy(),
        workFunction: Constants.Magnesium.WORK_FUNCTION,
        energyLevels: Constants.Magnesium.ENERGY_LEVELS
    })

}, Constants.Magnesium);

export default Magnesium;
