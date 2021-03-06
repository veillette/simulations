define(function (require) {

    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');

    var IntroSimulation = require('models/simulation/intro');

    var SimView        = require('common/v3/app/sim');
    var IntroSceneView = require('views/scene/intro');
    var Assets         = require('assets'); window.Assets = Assets;

    require('bootstrap');

    // CSS
    require('less!styles/sim');
    require('less!styles/playback-controls');
    require('less!common/styles/radio');

    // HTML
    var simHtml = require('text!templates/sim/intro.html');
    var controlsHtml = require('text!templates/intro-controls.html');

    /**
     *
     */
    var IntroSimView = SimView.extend({

        /**
         * Root element properties
         */
        tagName:   'section',
        className: 'sim-view',

        /**
         * Template for rendering the basic scaffolding
         */
        template: _.template(simHtml),
        controlsTemplate: _.template(controlsHtml),

        /**
         * Dom event listeners
         */
        events: {
            // Playback controls
            'click .play-btn'   : 'play',
            'click .pause-btn'  : 'pause',
            'click .step-btn'   : 'step',
            'click .reset-btn'  : 'reset',

            'change .playback-speed' : 'changePlaybackSpeed',

            'click .energy-symbols-checkbox': 'toggleEnergySymbols'
        },

        /**
         * Inits simulation, views, and variables.
         *
         * @params options
         */
        initialize: function(options) {
            options = _.extend({
                title: 'Intro',
                name: 'intro',
                link: 'energy-forms-and-changes',
            }, options);

            SimView.prototype.initialize.apply(this, [options]);

            // Initialize the scene view
            this.initSceneView();

            this.listenTo(this.simulation, 'change:paused', this.pausedChanged);
            this.pausedChanged(this.simulation, this.simulation.get('paused'));
        },

        /**
         * Initializes the Simulation.
         */
        initSimulation: function() {
            this.simulation = new IntroSimulation();
        },

        /**
         * Initializes the Simulation.
         */
        initSceneView: function() {
            this.sceneView = new IntroSceneView({
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
         *
         */
        renderSceneView: function() {
            this.sceneView.render();
            this.$('.scene-view-placeholder').replaceWith(this.sceneView.$el);
        },

        /**
         * Renders page content. Should be overriden by child classes
         */
        renderScaffolding: function() {
            this.$el.html(this.template());
        },

        /**
         * Renders the playback controls at the bottom of the screen
         */
        renderPlaybackControls: function() {
            this.$controls = $(this.controlsTemplate({
                unique: this.cid
            }));

            this.$('.playback-controls-placeholder').replaceWith(this.$controls);
        },

        /**
         * Called after every component on the page has rendered to make sure
         *   things like widths and heights and offsets are correct.
         */
        postRender: function() {
            this.sceneView.postRender();
        },

        /**
         * Tells the scene view to set everything back to defaults when
         *   the user initiates a reset.
         */
        rerender: function() {
            this.sceneView.reset();
            this.$('#playback-speed-normal').prop('checked', true);
            this.$('#intro-energy-symbols-checkbox').prop('checked', false);
            this.sceneView.hideEnergyChunks();
        },

        /**
         * This is run every tick of the updater.  It updates the wave
         *   simulation and the views.
         */
        update: function(time, deltaTime) {
            // Update the model
            this.simulation.update(time, deltaTime);

            // Update the scene
            this.sceneView.update(time / 1000, deltaTime / 1000, this.simulation.get('paused'), this.simulation.get('timeScale'));
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

        toggleEnergySymbols: function(event) {
            if ($(event.target).is(':checked'))
                this.sceneView.showEnergyChunks();
            else
                this.sceneView.hideEnergyChunks();
        },

        changePlaybackSpeed: function(event) {
            var speed = $(event.target).val();
            if (speed === 'normal')
                this.simulation.resetTimeScale();
            else
                this.simulation.fastForward();
        },

    });

    return IntroSimView;
});
