import Backbone from 'backbone';
import Constants from '../constants';

/**
 * Counts photons according to their wavelengths
 */
var Battery = Backbone.Model.extend({

    defaults: {
        enabled: true,
        voltage: 0,
        minVoltage: 0,
        maxVoltage: 0
    },

    initialize: function(attributes, options) {

        this.on('change:voltage', this.voltageChanged);
    },


    voltageChanged: function(battery, voltage) {
        if (voltage === 0)
            this.set('voltage', 0.004 * Constants.VOLTAGE_CALIBRATION_FACTOR);
    }

});


export default Battery;
