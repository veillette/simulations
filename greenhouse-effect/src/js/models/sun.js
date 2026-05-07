import _ from 'underscore';
import Vector2 from 'common/math/vector2';
import HorizontalPhotonEmitter from 'models/photon-emitter/horizontal';
import Constants from 'constants';

/**
 * Represents a photon-emitting sun.
 */
var Sun = HorizontalPhotonEmitter.extend({

    defaults: _.extend({}, HorizontalPhotonEmitter.prototype.defaults, {
        wavelength: Constants.SUNLIGHT_WAVELENGTH,
        radius: 0,
        position: null
    }),

    initialize: function(attributes, options) {
        HorizontalPhotonEmitter.prototype.initialize.apply(this, [attributes, options]);

        this.set('position', new Vector2(this.get('position')));
    }

}, Constants.Sun);

export default Sun;
