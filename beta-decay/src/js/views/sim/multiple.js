import _ from 'underscore';
import MultiNucleusBetaDecaySimulation from 'beta-decay/models/simulation/multi-nucleus';
import BetaDecaySimView from 'beta-decay/views/sim';
import MultiNucleusBetaDecaySceneView from 'beta-decay/views/scene/multiple';


/**
 * Multiple Atoms tab
 */
var MultiNucleusBetaDecaySimView = BetaDecaySimView.extend({

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Multiple Atoms',
            name: 'multiple-atoms',
            link: 'beta-decay'
        }, options);

        BetaDecaySimView.prototype.initialize.apply(this, [options]);
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new MultiNucleusBetaDecaySimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new MultiNucleusBetaDecaySceneView({
            simulation: this.simulation
        });
    }

});

export default MultiNucleusBetaDecaySimView;
