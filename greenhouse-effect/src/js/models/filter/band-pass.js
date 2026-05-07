import _ from 'underscore';
import Filter from 'models/filter';

/**
 *
 */
var BandPassFilter = function(low, high) {
    Filter.apply(this, arguments);

    this.low  = low;
    this.high = high;
};

/**
 * Instance functions/properties
 */
_.extend(BandPassFilter.prototype, Filter.prototype, {

    /**
     * Returns whether or not a certain value passes
     *   through the filter.
     */
    passes: function(value) {
        return value >= this.low && value <= this.high;
    }

});

export default BandPassFilter;
