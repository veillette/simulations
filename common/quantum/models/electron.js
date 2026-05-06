import _ from 'underscore';
import Vector2 from 'common/math/vector2';
import SphericalBody from 'common/mechanics/models/spherical-body';
import PhysicsUtil from './physics-util';
import QuantumConfig from '../config';

/**
 * Represents an electron
 */
var Electron = SphericalBody.extend({

    defaults: _.extend({}, SphericalBody.prototype.defaults, {
        // Radius of an electron. An arbitrary dimension based on how it looks on the screen
        radius: 2,
        mass: PhysicsUtil.ELECTRON_MASS
    }),

    /**
     * 
     */
    initialize: function(attributes, options) {
        SphericalBody.prototype.initialize.apply(this, [attributes, options]);

        // Cached objects
        this._velocity = new Vector2();
    },

    /**
     * Sets a flag for the electron to be destroyed on the next loop
     */
    markForDestruction: function() {
        this._markedForDestruction = true;
    },

    /**
     * Returns whether the electron has been marked for destruction
     */
    markedForDestruction: function() {
        return this._markedForDestruction;
    },

    /**
     * Returns the the energy of the electron in Joules
     *
     * @return
     */
    getEnergy: function() {
        var ke = QuantumConfig.PIXELS_PER_NM * QuantumConfig.PIXELS_PER_NM * this.get('velocity').lengthSq() * this.get('mass') / 2;
        var ev = ke * PhysicsUtil.EV_PER_JOULE;
        return ev;
    },

    /**
     * Sets the energy of the electron, in EV
     */
    setEnergy: function(e) {
        var ke = e * PhysicsUtil.JOULES_PER_EV;

        // compute the speed of the electron
        var sNew = Math.sqrt(2 * ke / this.get('mass'));
        var sCurr = this.get('velocity').length();
        this.setVelocity(this._velocity.set(this.get('velocity')).scale(sNew / sCurr / QuantumConfig.PIXELS_PER_NM));
    }

});

export default Electron;