import Backbone from 'backbone';
import Constants from 'constants';

var BeamControl = Backbone.Model.extend({
    defaults: {
        wavelength: 400,
        intensity: 100
    },

    initialize: function(attributes, options) {

    }
}, Constants.BeamControl);

export default BeamControl;
