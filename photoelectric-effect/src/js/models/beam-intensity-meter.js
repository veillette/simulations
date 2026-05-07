import _ from 'underscore';
import ScalarDataRecorder from 'models/scalar-data-recorder';


/**
 * Calculates the intensity of the beam at regular intervals
 */
var BeamIntensityMeter = function() {
    ScalarDataRecorder.apply(this, arguments);
};

_.extend(BeamIntensityMeter.prototype, ScalarDataRecorder.prototype, {

    recordPhoton: function(time) {
        this.recordPhotons(time, 1);
    },

    recordPhotons: function(time, numPhotons) {
        this.addDataRecord(time, numPhotons);
    },

    getIntesity: function() {
        var intensity = this.total / this.timeSpanOfEntries;
        if (Number.isNaN(intensity) || !Number.isFinite(intensity))
            intensity = 0;
        return intensity;
    }

});


export default BeamIntensityMeter;