import Backbone from 'backbone';
import MediumColorFactory from 'models/medium-color-factory';

/**
 * Holds information for a medium
 */
var Medium = Backbone.Model.extend({

    defaults: {
        shape: null,
        mediumProperties: null,
        color: null
    },

    initialize: function(attributes, options) {
        this.on('change:mediumProperties', this.mediumPropertiesChanged);

        // Set starting color
        this.updateColor();
    },

    getIndexOfRefraction: function(wavelength) {
        return this.get('mediumProperties').dispersionFunction.getIndexOfRefraction(wavelength);
    },

    updateColor: function() {
        this.mediumPropertiesChanged(this, this.get('mediumProperties'));
    },

    mediumPropertiesChanged: function(model, mediumProperties) {
        this.set('color', MediumColorFactory.getRgbaColor(mediumProperties.getIndexOfRefractionForRedLight()));
    }

});

export default Medium;
