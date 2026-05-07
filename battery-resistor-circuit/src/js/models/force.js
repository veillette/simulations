import _ from 'underscore';

var Force = function() {};

/**
 * Instance functions/properties
 */
_.extend(Force.prototype, {

    getForce: function(wireParticle) {
        throw 'Function not implemented.';
    }

});

export default Force;
