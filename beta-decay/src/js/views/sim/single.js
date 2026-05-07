import _ from 'underscore';
import SingleNucleusBetaDecaySimulation from 'beta-decay/models/simulation/single-nucleus';
import BetaDecaySimView from 'beta-decay/views/sim';
import SingleNucleusBetaDecaySceneView from 'beta-decay/views/scene/single';


/**
 * Single Atom tab
 */
var SingleNucleusBetaDecaySimView = BetaDecaySimView.extend({

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Single Atom',
            name: 'single-atom',
            link: 'beta-decay'
        }, options);

        BetaDecaySimView.prototype.initialize.apply(this, [options]);
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new SingleNucleusBetaDecaySimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new SingleNucleusBetaDecaySceneView({
            simulation: this.simulation
        });
    }

});

export default SingleNucleusBetaDecaySimView;
