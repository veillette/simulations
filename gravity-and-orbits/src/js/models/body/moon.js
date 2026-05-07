import _ from 'underscore';
import Body from 'models/body';
import Constants from 'constants';

/**
 *
 */
var Moon = Body.extend({

    defaults: _.extend({}, Body.prototype.defaults, {
        name: 'moon',
        referenceMassLabel: 'our moon',
        color: Constants.MOON_COLOR
    })

});

export default Moon;
