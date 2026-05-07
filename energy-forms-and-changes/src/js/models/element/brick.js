import _ from 'underscore';
import Block from 'models/element/block';
import Constants from 'constants';
var EnergyContainerCategory = Constants.EnergyContainerCategory;

/**
 *
 */
var Brick = Block.extend({

    defaults: _.extend({}, Block.prototype.defaults, {
        energyContainerCategory: EnergyContainerCategory.BRICK,

        density:      Constants.Brick.DENSITY,
        specificHeat: Constants.Brick.SPECIFIC_HEAT
    })

}, Constants.Brick);

export default Brick;
