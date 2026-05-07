import _ from 'underscore';
import DischargeLampElementProperties from 'discharge-lamps/models/element-properties';
import DefaultEnergyEmissionStrategy from 'discharge-lamps/models/default-energy-emission-strategy';
import MetalEnergyAbsorptionStrategy from 'models/metal-energy-absorption-strategy';
import Constants from 'constants';

/**
 * Zinc
 */
var Zinc = DischargeLampElementProperties.extend({

    defaults: _.extend({}, DischargeLampElementProperties.prototype.defaults, {
        name: Constants.Zinc.NAME,
        energyAbsorptionStrategy: new MetalEnergyAbsorptionStrategy(Constants.Zinc.WORK_FUNCTION),
        energyEmissionStrategy: new DefaultEnergyEmissionStrategy(),
        workFunction: Constants.Zinc.WORK_FUNCTION,
        energyLevels: Constants.Zinc.ENERGY_LEVELS
    })

}, Constants.Zinc);

export default Zinc;
