import _ from 'underscore';
import DatingGameSimulation from 'radioactive-dating-game/models/simulation/dating-game';
import RadioactiveDatingGameSimView from 'radioactive-dating-game/views/sim';
import DatingGameSceneView from 'radioactive-dating-game/views/scene/dating-game';
import simHtml from 'radioactive-dating-game/templates/dating-game-sim.html?raw';

/**
 * Multiple Atoms tab
 */
var DatingGameSimView = RadioactiveDatingGameSimView.extend({

    events: _.extend({}, RadioactiveDatingGameSimView.prototype.events, {

    }),

    /**
     * Template for rendering the basic scaffolding
     */
    template: _.template(simHtml),

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Dating Game',
            name: 'dating-game'
        }, options);

        RadioactiveDatingGameSimView.prototype.initialize.apply(this, [options]);
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new DatingGameSimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new DatingGameSceneView({
            simulation: this.simulation
        });
    },

    /**
     * Renders playback controls
     */
    renderPlaybackControls: function() {
        // No controls necessary
    },

    /**
     * Renders everything
     */
    postRender: function() {
        RadioactiveDatingGameSimView.prototype.postRender.apply(this, arguments);

        return this;
    },

    setSoundVolumeMute: function() {
        this.sceneView.setSoundVolumeMute();
    },

    setSoundVolumeLow: function() {
        this.sceneView.setSoundVolumeLow();
    },

    setSoundVolumeHigh: function() {
        this.sceneView.setSoundVolumeHigh();
    }

});

export default DatingGameSimView;
