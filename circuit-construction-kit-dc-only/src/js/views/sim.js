import _ from 'underscore';
import CCKSimView from 'views/sim';

/**
 * "DCOnly" version of the original
 */
var DCOnlySimView = CCKSimView.extend({

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            link: 'circuit-construction-kit-dc',
            dcOnly: true
        }, options);

        CCKSimView.prototype.initialize.apply(this, [options]);
    }

});

export default DCOnlySimView;
