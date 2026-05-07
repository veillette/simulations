import _ from 'underscore';
import PositionableObject from 'common/models/positionable-object';
import Vector2 from 'common/math/vector2';

var FaradayObject = PositionableObject.extend({

    defaults: _.extend({}, PositionableObject.prototype.defaults, {
        direction: 0, // The rotation of the object in radians
        enabled: true
    }),

    initialize: function(attributes, options) {
        PositionableObject.prototype.initialize.apply(this, arguments);

        this._startingAttributes = this.toJSON();
        _.each(this._startingAttributes, function(value, key) {
            if (value instanceof Vector2)
                this._startingAttributes[key] = new Vector2(value);
        }, this);
    },

    reset: function() {
        this.set(_.omit(this._startingAttributes, 'position'));
        this.setPosition(this._startingAttributes.position);
    }

});

export default FaradayObject;
