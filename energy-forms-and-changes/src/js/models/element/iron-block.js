define(function (require) {

	'use strict';

	var _ = require('underscore');

	var Block                   = require('models/element/block');
	var EnergyContainerCategory = require('models/energy-container-category');

	/**
	 * Constants
	 */
	var Constants = require('models/constants');

	/**
	 * 
	 */
	var IronBlock = Block.extend({

		defaults: _.extend({}, Block.prototype.defaults, {
			energyContainerCategory: EnergyContainerCategory.IRON
		})

	}, Constants.Iron);

	return IronBlock;
});
