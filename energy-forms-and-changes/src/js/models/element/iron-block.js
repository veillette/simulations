import _ from 'underscore';
import Block from 'models/element/block';
import Constants from 'constants';
var EnergyContainerCategory = Constants.EnergyContainerCategory;

/**
 *
 */
var IronBlock = Block.extend({

    defaults: _.extend({}, Block.prototype.defaults, {
        energyContainerCategory: EnergyContainerCategory.IRON,

        density:      Constants.Iron.DENSITY,
        specificHeat: Constants.Iron.SPECIFIC_HEAT
    })

}, Constants.Iron);

export default IronBlock;
