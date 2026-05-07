import _ from 'underscore';
import Body from 'models/body';
import Constants from 'constants';

/**
 *
 */
var Planet = Body.extend({

    defaults: _.extend({}, Body.prototype.defaults, {
        name: 'planet',
        referenceMassLabel: 'Earth',
        color: Constants.PLANET_COLOR
    })

});

export default Planet;
