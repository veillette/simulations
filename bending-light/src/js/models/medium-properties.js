import _ from 'underscore';
import DispersionFunction from 'models/dispersion-function';
import Constants from 'constants';

/**
 * Holds information for a medium
 */
var MediumProperties = function(name, indexForRed, mystery, custom) {
    this.name = name;
    this.mystery = mystery;
    this.custom = custom;

    if (typeof indexForRed === 'function')
        this.dispersionFunction = indexForRed;
    else
        this.dispersionFunction = new DispersionFunction(indexForRed);
};

/**
 * Instance functions/properties
 */
_.extend(MediumProperties.prototype, {

    getIndexOfRefractionForRedLight: function() {
        return this.dispersionFunction.getIndexOfRefraction(Constants.WAVELENGTH_RED);
    },

    setIndexOfRefraction: function(indexOfRefraction) {
        this.dispersionFunction.setIndexOfRefraction(indexOfRefraction);
    },

    setReferenceWavelength: function(wavelength) {
        this.dispersionFunction.setReferenceWavelength(wavelength);
    }

});

export default MediumProperties;
