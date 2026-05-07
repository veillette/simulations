import BatteryToCapacitorsWire from 'models/wire/battery-to-capacitors';
import Constants from 'constants';
var ConnectionPoint = Constants.ConnectionPoint;

/**
 * Connects the top of the battery (B) to the tops of N capacitors (C1...Cn).
 *   Constructor args are described in superclass constructor.
 */
var BatteryToCapacitorsTopWire = BatteryToCapacitorsWire.extend({

    initialize: function(attributes, options) {
        options.connectionPoint = ConnectionPoint.TOP;

        BatteryToCapacitorsWire.prototype.initialize.apply(this, [attributes, options]);
    }

});

export default BatteryToCapacitorsTopWire;