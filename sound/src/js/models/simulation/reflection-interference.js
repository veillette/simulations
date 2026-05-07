import _ from 'underscore';
import SoundSimulation from 'models/simulation';
import Constants from 'constants';

/**
 *
 */
var ReflectionInterferenceSimulation = SoundSimulation.extend({

    defaults: _.extend({}, SoundSimulation.prototype.defaults, {
        amplitude: Constants.MAX_AMPLITUDE
    })

});

export default ReflectionInterferenceSimulation;
