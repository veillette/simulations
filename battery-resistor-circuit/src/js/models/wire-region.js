import _ from 'underscore';

var WireRegion = function() {};

/**
 * Instance functions/properties
 */
_.extend(WireRegion.prototype, {

    contains: function(wireParticle) {
        throw 'Update function not implemented.';
    }

});

export default WireRegion;
