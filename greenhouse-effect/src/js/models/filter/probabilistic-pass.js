import _ from 'underscore';
import Filter from 'models/filter';

/**
 * A filter that is based purely off of a specified probability.
 */
var ProbabilisticPassFilter = function(probability) {
    Filter.apply(this, arguments);

    this.probability = probability;
};

/**
 * Instance functions/properties
 */
_.extend(ProbabilisticPassFilter.prototype, Filter.prototype, {

    /**
     * Returns whether or not a certain value passes
     *   through the filter.
     */
    passes: function(value) {
        return Math.random() <= this.probability;
    }

});

export default ProbabilisticPassFilter;
