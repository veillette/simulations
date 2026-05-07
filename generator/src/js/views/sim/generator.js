import _ from 'underscore';
import GeneratorSimView from 'views/sim/generator';

/**
 * "Generator" version of the original
 */
var GeneratorGeneratorSimView = GeneratorSimView.extend({

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            link: 'generator'
        }, options);

        GeneratorSimView.prototype.initialize.apply(this, [options]);
    }

});

export default GeneratorGeneratorSimView;
