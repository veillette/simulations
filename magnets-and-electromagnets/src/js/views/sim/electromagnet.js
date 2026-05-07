import _ from 'underscore';
import ElectromagnetSimView from 'views/sim/electromagnet';

/**
 * "Magnets and Electromagnets" version of the original
 */
var MEElectromagnetSimView = ElectromagnetSimView.extend({

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            link: 'magnets-and-electromagnets'
        }, options);

        ElectromagnetSimView.prototype.initialize.apply(this, [options]);
    }

});

export default MEElectromagnetSimView;
