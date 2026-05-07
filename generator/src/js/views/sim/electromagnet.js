import _ from 'underscore';
import ElectromagnetSimView from 'views/sim/electromagnet';

/**
 * "Generator" version of the original
 */
var GeneratorElectromagnetSimView = ElectromagnetSimView.extend({

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            link: 'generator'
        }, options);

        ElectromagnetSimView.prototype.initialize.apply(this, [options]);
    }

});

export default GeneratorElectromagnetSimView;
