import _ from 'underscore';
import GOSimulation from 'models/simulation';
import GOSimView from 'views/sim';
import Scenarios from 'scenarios';

/**
 *
 */
var FriendlyScaleSimView = GOSimView.extend({

    initialize: function(options) {
        options = _.extend({
            title: 'Friendly Scale',
            name:  'friendly'
        }, options);

        GOSimView.prototype.initialize.apply(this, [ options ]);
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new GOSimulation({
            scenario: Scenarios.Friendly[0]
        });
    },

    getScenarios: function() {
        return Scenarios.Friendly;
    }

});

export default FriendlyScaleSimView;
