import _ from 'underscore';
import DischargeLampElementProperties from 'discharge-lamps/models/element-properties';
import DefaultEnergyEmissionStrategy from 'discharge-lamps/models/default-energy-emission-strategy';
import MetalEnergyAbsorptionStrategy from 'models/metal-energy-absorption-strategy';
import Constants from 'constants';

/**
 * Calcium
 */
var Calcium = DischargeLampElementProperties.extend({

    defaults: _.extend({}, DischargeLampElementProperties.prototype.defaults, {
        name: Constants.Calcium.NAME,
        energyAbsorptionStrategy: new MetalEnergyAbsorptionStrategy(Constants.Calcium.WORK_FUNCTION),
        energyEmissionStrategy: new DefaultEnergyEmissionStrategy(),
        workFunction: Constants.Calcium.WORK_FUNCTION,
        energyLevels: Constants.Calcium.ENERGY_LEVELS
    })

}, Constants.Calcium);


export default Calcium;
