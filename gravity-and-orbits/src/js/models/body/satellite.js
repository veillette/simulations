import _ from 'underscore';
import Body from 'models/body';
import Constants from 'constants';

/**
 *
 */
var Satellite = Body.extend({

    defaults: _.extend({}, Body.prototype.defaults, {
        name: 'satellite',
        referenceMassLabel: 'space station',
        color: Constants.SATELLITE_COLOR
    })

});

export default Satellite;
