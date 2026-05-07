import _ from 'underscore';
import Force from 'models/force';

/**
 *
 */
var FrictionForce = function(value) {
    this.value = value;
};

/**
 * Instance functions/properties
 */
_.extend(FrictionForce.prototype, Force.prototype, {

    getForce: function(wireParticle) {
        var v = wireParticle.velocity;
        var f = -v * this.value;
        return f;
    }

});

export default FrictionForce;
