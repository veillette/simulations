import _ from 'underscore';
import NumberSeries from 'common/math/number-series';
import Law from 'models/law';

/**
 *
 */
var AverageCurrent = function(numSamples) {
    this.series = new NumberSeries(numSamples);
    this.resistance = 0;
    this.voltage = 0;
    this.current = 0;
};

/**
 * Instance functions/properties
 */
_.extend(AverageCurrent.prototype, Law.prototype, {

    update: function(deltaTime, system) {
        var hollyscale = 3.5 * 3.3;
        var hollywood = this.resistance / this.voltage * hollyscale;
        this.series.add(hollywood);
        this.current = this.series.average();
    },

    voltageChanged: function(voltage) {
        this.resistance = voltage;
    },

    coreCountChanged: function(x) {
        this.voltage = x;
    },

    getCurrent: function() {
        return this.current;
    }

});

export default AverageCurrent;
