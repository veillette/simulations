import _ from 'underscore';
import TransformerSimView from 'views/sim/transformer';

/**
 * "Generator" version of the original
 */
var GeneratorTransformerSimView = TransformerSimView.extend({

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            link: 'generator'
        }, options);

        TransformerSimView.prototype.initialize.apply(this, [options]);
    }

});

export default GeneratorTransformerSimView;
