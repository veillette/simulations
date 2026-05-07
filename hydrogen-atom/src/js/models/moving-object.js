import _ from 'underscore';
import VanillaPositionableObject from 'common/models/positionable-object-vanilla';

/**
 * MovingObject is an object that has mutable position, orientation and speed.
 */
var MovingObject = VanillaPositionableObject.extend({

    defaults: _.extend({}, VanillaPositionableObject.prototype.defaults, {
        // Distance moved per deltaTime
        speed: 0,
        // Orientation in radians
        orientation: 0
    }),

    getOrientation: function() {
        return this.get('orientation');
    },

    getSpeed: function() {
        return this.get('speed');
    }

});

export default MovingObject;