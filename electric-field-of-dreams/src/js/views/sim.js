import _ from 'underscore';
import SimView from 'common/v3/app/sim';
import EFDSimulation from 'models/simulation';
import EFDSceneView from 'views/scene';
import Constants from 'constants';
import 'nouislider';
import 'common/styles/slider.less';
import 'common/styles/radio.less';
import 'styles/sim.less';
import 'styles/playback-controls.less';
import simHtml from 'templates/sim.html?raw';
import playbackControlsHtml from 'templates/playback-controls.html?raw';

/**
 * This is the umbrella view for everything in a simulation tab.
 *   It will be extended by both the Intro module and the Charts
 *   and contains all the common functionality between the two.
 */
var EFDSimView = SimView.extend({

    /**
     * Root element properties
     */
    tagName:   'section',
    className: 'sim-view',

    /**
     * Template for rendering the basic scaffolding
     */
    template: _.template(simHtml),

    /**
     * Dom event listeners
     */
    events: {
        'click .play-btn'   : 'play',
        'click .pause-btn'  : 'pause',
        'click .step-btn'   : 'step',
        'click .reset-btn'  : 'reset',

        'click .add-btn'    : 'addParticle',
        'click .remove-btn' : 'removeParticle'
    },

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Electric Field of Dreams',
            name: 'electric-field-of-dreams',
            link: 'efield'
        }, options);

        SimView.prototype.initialize.apply(this, [options]);

        this.initSceneView();

        this.listenTo(this.simulation, 'change:paused', this.pausedChanged);
        this.pausedChanged(this.simulation, this.simulation.get('paused'));
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new EFDSimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new EFDSceneView({
            simulation: this.simulation
        });
    },

    /**
     * Renders everything
     */
    render: function() {
        this.$el.empty();

        this.renderScaffolding();
        this.renderSceneView();
        this.renderPlaybackControls();

        return this;
    },

    /**
     * Renders page content. Should be overriden by child classes
     */
    renderScaffolding: function() {
        var data = {
            Constants: Constants,
            simulation: this.simulation
        };
        this.$el.html(this.template(data));
        this.$('select');
    },

    /**
     * Renders the scene view
     */
    renderSceneView: function() {
        this.sceneView.render();
        this.$('.scene-view-placeholder').replaceWith(this.sceneView.el);
        this.$el.append(this.sceneView.ui);
    },

    /**
     * Renders playback controls bar
     */
    renderPlaybackControls: function() {
        this.$el.append(playbackControlsHtml);
    },

    /**
     * Called after every component on the page has rendered to make sure
     *   things like widths and heights and offsets are correct.
     */
    postRender: function() {
        this.sceneView.postRender();
    },

    /**
     * Resets the simulation and all settings
     */
    resetSimulation: function() {
        this.pause();
        this.resetComponents();
        this.play();
        this.pausedChanged(this.simulation, this.simulation.get('paused'));
    },

    /**
     * Performs the actual resetting on everything
     */
    resetComponents: function() {
        this.simulation.reset();
        this.sceneView.reset();
    },

    /**
     * This is run every tick of the updater.  It updates the wave
     *   simulation and the views.
     */
    update: function(time, deltaTime) {
        // Update the model
        this.simulation.update(time, deltaTime);

        var timeSeconds = time / 1000;
        var dtSeconds   = deltaTime / 1000;

        // Update the scene
        this.sceneView.update(timeSeconds, dtSeconds, this.simulation.get('paused'));
    },

    /**
     * The simulation changed its paused state.
     */
    pausedChanged: function() {
        if (this.simulation.get('paused'))
            this.$el.removeClass('playing');
        else
            this.$el.addClass('playing');
    },

    setEFieldDiscreteness: function(discreteness) {
        this.simulation.set('fieldLatticeWidth', discreteness);
    },

    addParticle: function() {
        var charge = parseFloat(this.$('#charge').val());
        var mass   = parseFloat(this.$('#mass').val());

        this.simulation.addParticle(charge, mass);
    },

    removeParticle: function() {
        this.simulation.removeParticle();
    }

});

export default EFDSimView;
