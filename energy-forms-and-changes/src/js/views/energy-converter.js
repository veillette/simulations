import EnergySystemsElementView from 'views/energy-systems-element';

/**
 * A view that represents an element model
 */
var EnergyConverterView = EnergySystemsElementView.extend({

    /**
     *
     */
    initialize: function(options) {
        EnergySystemsElementView.prototype.initialize.apply(this, [options]);
    }

});

export default EnergyConverterView;