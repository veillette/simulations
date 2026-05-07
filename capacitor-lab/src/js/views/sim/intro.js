import _ from 'underscore';
import DielectricSimulation from 'models/simulation/dielectric';
import CapacitorLabSimView from 'views/sim';
import IntroSceneView from 'views/scene/intro';
import Constants from 'constants';

/**
 *
 */
var IntroSimView = CapacitorLabSimView.extend({

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Introduction',
            name: 'intro',
        }, options);

        CapacitorLabSimView.prototype.initialize.apply(this, [options]);
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new DielectricSimulation({
            // The dielectric needs to be moved outside the bounds of effectiveness
            startingDielectricOffset: Constants.DIELECTRIC_OFFSET_RANGE.max + 1
        });
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new IntroSceneView({
            simulation: this.simulation
        });
    },

});

export default IntroSimView;
