import _ from 'underscore';
import Body from 'models/body';
import Constants from 'constants';

/**
 *
 */
var Sun = Body.extend({

    defaults: _.extend({}, Body.prototype.defaults, {
        name: 'star',
        referenceMassLabel: 'our sun',
        color: Constants.SUN_COLOR
    })

});

export default Sun;
