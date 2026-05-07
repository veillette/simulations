import _ from 'underscore';
import Resistor from 'models/components/resistor';

/**
 * A resistor
 */
var GrabBagResistor = Resistor.extend({

    defaults: _.extend({}, Resistor.prototype.defaults, {
        grabBagItem: undefined
    }),

    initialize: function(attributes, options) {
        Resistor.prototype.initialize.apply(this, [attributes, options]);
    }

});

export default GrabBagResistor;