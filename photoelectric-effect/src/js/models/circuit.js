import Backbone from 'backbone';
import Constants from 'constants';

var Circuit = Backbone.Model.extend({
    defaults: {
        voltage: 0,
        circuitIsPositive: true
    },

    initialize: function(attributes, options) {

    }
}, Constants.Circuit);

export default Circuit;
