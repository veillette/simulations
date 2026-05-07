import _ from 'underscore';
import DecayRatesSimulation from 'radioactive-dating-game/models/simulation/decay-rates';
import RadioactiveDatingGameSimView from 'radioactive-dating-game/views/sim';
import DecayRatesSceneView from 'radioactive-dating-game/views/scene/decay-rates';
import DecayRatesNucleusChooserView from 'radioactive-dating-game/views/nucleus-chooser/decay-rates';
import simHtml from 'radioactive-dating-game/templates/multi-nucleus-sim.html?raw';
import playbackControlsHtml from 'radioactive-dating-game/templates/decay-rates-playback-controls.html?raw';

/**
 * Multiple Atoms tab
 */
var DecayRatesSimView = RadioactiveDatingGameSimView.extend({

    /**
     * Template for rendering the basic scaffolding
     */
    template: _.template(simHtml),
    playbackControlsTemplate: _.template(playbackControlsHtml),

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Decay Rates',
            name: 'decay-rates'
        }, options);

        RadioactiveDatingGameSimView.prototype.initialize.apply(this, [options]);

        this.initNucleusChooser();
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new DecayRatesSimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new DecayRatesSceneView({
            simulation: this.simulation
        });
    },

    initNucleusChooser: function() {
        this.nucleusChooserView = new DecayRatesNucleusChooserView({
            simulation: this.simulation
        });
    },

    renderNucleusChooser: function() {
        this.nucleusChooserView.render();
        this.$('.choose-nucleus-panel').append(this.nucleusChooserView.el);
    },

    /**
     * Renders everything
     */
    postRender: function() {
        RadioactiveDatingGameSimView.prototype.postRender.apply(this, arguments);

        this.renderNucleusChooser();

        return this;
    }

});

export default DecayRatesSimView;
