import Backbone from 'backbone';
import Constants from 'constants';

var DEGREES_TO_RADIANS = Math.PI / 180;

/**
 *
 */
var Cannon = Backbone.Model.extend({

    defaults: {
        x: 0,
        y: 0,
        angle: 0,
        width: Constants.Cannon.WIDTH,
        heightOffGround: Constants.Cannon.HEIGHT_OFF_GROUND
    },

    initialize: function(attributes, options) {

    },

    firingX: function() {
        return this.get('x');
    },

    firingY: function() {
        return this.get('y');
    },

    firingAngle: function() {
        return -this.get('angle') * DEGREES_TO_RADIANS;
    },

    fire: function() {
        this.trigger('fire');
    }

}, Constants.Cannon);

export default Cannon;
