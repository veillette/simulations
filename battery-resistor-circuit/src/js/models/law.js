import _ from 'underscore';

var Law = function() {};

/**
 * Instance functions/properties
 */
_.extend(Law.prototype, {

    update: function(deltaTime, system) {
        throw 'Update function not implemented.';
    }

});

export default Law;
