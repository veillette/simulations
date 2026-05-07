import _ from 'underscore';

var MovementStrategy = function() {};

/**
 * Instance functions/properties
 */
_.extend(MovementStrategy.prototype, {

    update: function(deltaTime) {},

    getVelocity: function() {},

    getAcceleration: function() {},

    getNextPosition: function(position, t) {},

    getMaxAcceleration: function() {}

});

export default MovementStrategy;
