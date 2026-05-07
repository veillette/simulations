import _ from 'underscore';
import Particle from 'common/mechanics/models/particle';

/**
 * A heating element
 */
var HeatingElement = Particle.extend({

    defaults: _.extend({}, Particle.prototype.defaults, {
        enabled: true,
        temperature: 0
    })

});


export default HeatingElement;
