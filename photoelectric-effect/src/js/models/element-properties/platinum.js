import _ from 'underscore';
import DischargeLampElementProperties from 'discharge-lamps/models/element-properties';
import DefaultEnergyEmissionStrategy from 'discharge-lamps/models/default-energy-emission-strategy';
import MetalEnergyAbsorptionStrategy from 'models/metal-energy-absorption-strategy';
import Constants from 'constants';

/**
 * Platinum
 */
var Platinum = DischargeLampElementProperties.extend({

    defaults: _.extend({}, DischargeLampElementProperties.prototype.defaults, {
        name: Constants.Platinum.NAME,
        energyAbsorptionStrategy: new MetalEnergyAbsorptionStrategy(Constants.Platinum.WORK_FUNCTION),
        energyEmissionStrategy: new DefaultEnergyEmissionStrategy(),
        workFunction: Constants.Platinum.WORK_FUNCTION,
        energyLevels: Constants.Platinum.ENERGY_LEVELS
    })

}, Constants.Platinum);

export default Platinum;
