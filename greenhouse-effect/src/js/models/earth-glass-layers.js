import Earth from 'models/earth';
import TemperatureTransformer from 'models/temperature-transformer';

var temperatureTransformer = new TemperatureTransformer([
    [0, 0],
    [255, 255],
    [272, 303],
    [283, 335],
    [286, 361],
    [1000, 1400]
]);

var GlassLayersEarth = Earth.extend({

    /**
     * Computes the current temperature from the history of past
     *   temperatures and the current net energy and returns it.
     *   This version also "jimmies" the value according to our
     *   linear transformation values above.
     */
    computeTemperature: function() {
        var temperature = Earth.prototype.computeTemperature.apply(this, arguments);

        return temperatureTransformer.transformTemperature(temperature);
    }

});

export default GlassLayersEarth;
