import _ from 'underscore';
import PositionableObject from 'common/models/positionable-object';

/**
 *
 */
var VelocitySensor = PositionableObject.extend({

    defaults: _.extend({}, PositionableObject.prototype.defaults, {
        velocity: null,
        enabled: false
    })

});

export default VelocitySensor;
