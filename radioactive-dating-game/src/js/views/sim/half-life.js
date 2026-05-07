import _ from 'underscore';
import HalfLifeSimulation from 'radioactive-dating-game/models/simulation/half-life';
import RadioactiveDatingGameSimView from 'radioactive-dating-game/views/sim';
import HalfLifeSceneView from 'radioactive-dating-game/views/scene/half-life';
import HalfLifeNucleusChooserView from 'radioactive-dating-game/views/nucleus-chooser/half-life';
import simHtml from 'radioactive-dating-game/templates/multi-nucleus-sim.html?raw';
import playbackControlsHtml from 'radioactive-dating-game/templates/half-life-playback-controls.html?raw';

/**
 * Multiple Atoms tab
 */
var HalfLifeSimView = RadioactiveDatingGameSimView.extend({

    events: _.extend({}, RadioactiveDatingGameSimView.prototype.events, {
        'click .show-labels-check' : 'toggleLabels'
    }),

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
            title: 'Half Life',
            name: 'half-life'
        }, options);

        RadioactiveDatingGameSimView.prototype.initialize.apply(this, [options]);

        this.initNucleusChooser();
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new HalfLifeSimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new HalfLifeSceneView({
            simulation: this.simulation
        });
    },

    initNucleusChooser: function() {
        this.nucleusChooserView = new HalfLifeNucleusChooserView({
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
    },

    toggleLabels: function(event) {
        if ($(event.target).is(':checked'))
            this.sceneView.showLabels();
        else
            this.sceneView.hideLabels();
    }

});

export default HalfLifeSimView;
