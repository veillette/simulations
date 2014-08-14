define([
	'jquery', 
	'underscore', 
	'backbone',
	'pixi',

	'models/wave-simulation',
	'utils/updater',

	'text!templates/sim-playback.html',
], function ($, _, Backbone, PIXI, WaveSimulation, Updater, playbackControls) {

	'use strict';

	var SimView = Backbone.View.extend({

		/**
		 * Root element properties
		 */
		tagName: 'section',
		className: 'sim-view',

		/**
		 * Dom event listeners
		 */
		events: {
			'click .play-btn' : 'play',
			'click .pause-btn': 'pause',
			'click .step-btn' : 'step',
			'click .reset-btn': 'reset'
		},

		/**
		 * Inits stage, simulation, visualizers, and variables.
		 *
		 * @params options
		 */
		initialize: function(options) {
			options = options || {};

			this.stage = new PIXI.Stage(0xFFFFFF);

			this.waveSimulation = new WaveSimulation({
				damping:    options.simulationDamping,
				dimensions: options.simulationDimensions
			});

			this.update = _.bind(this.update, this);

			this.updater = new Updater();
			this.updater.addFrameListener(this.update);

			// We want it to start playing when they first open the tab
			this.resumePaused = false;
			this.$el.addClass('playing');

			// Test code
			this.graphics = new PIXI.Graphics()
				.beginFill(0x8888FF)
				.moveTo(-50, -50)
				.lineTo(50, 100)
				.lineTo(100,-50)
				.lineTo(-50,-50)
				.endFill();
			this.graphics.position.x = 200;
			this.graphics.position.y = 200;
			this.direction = 1;
			this.stage.addChild(this.graphics);

			$(window).bind('resize', $.proxy(this.resize, this));
		},

		/**
		 * Makes Simulation model properties accesssible
		 *
		 * @params key
		 */
		get: function(key) {
			if (this.model)
				return this.model.get(key);
			else
				return null;
		},

		/**
		 * Renders content and simulation canvas
		 */
		render: function() {
			this.$el.empty();

			this.renderContent();
			this.renderCanvas();
			this.renderPlaybackControls();

			return this;
		},

		/**
		 * Renders page content. Should be overriden by child classes
		 */
		renderContent: function() {},

		renderPlaybackControls: function() {
			this.$el.append(playbackControls);
		},

		/**
		 * Initializes a renderer and prepends a canvas to the root element
		 */
		renderCanvas: function() {
			this.renderer = PIXI.autoDetectRenderer(null, null, null, false, true); // Turn on antialiasing

			var $renderer = $(this.renderer.view);
			$renderer.addClass('sim-canvas');
			this.$el.prepend($renderer);
		},

		/**
		 * Called on a window resize to resize the canvas
		 */
		resize: function(event) {
			$area = this.$el.parents('.sims');
			this.renderer.resize($area.width(), $area.height());
		},

		/**
		 * Click event handler that plays the simulation
		 */
		play: function(event) {
			this.updater.play();
			this.$el.addClass('playing');
		},

		/**
		 * Click event handler that pauses the simulation
		 */
		pause: function(event) {
			this.updater.pause();
			this.$el.removeClass('playing');
		},

		/**
		 * Click event handler that plays the simulation for a specified duration
		 */
		step: function(event) {
			var milliseconds = 100;
			this.play();
			setTimeout(_.bind(this.pause, true), milliseconds);
		},

		/**
		 * Click event handler that resets the simulation back to time zero.
		 */
		reset: function(event) {
			this.updater.reset();
			this.waveSimulation.reset();
		},

		/**
		 * If we switch to a new sim, we pause this one,
		 *   but we want to save whether or not it was
		 *   paused already so it doesn't resume when we
		 *   don't want it to.
		 */
		halt: function() {
			this.updater.pause();
		},

		/**
		 * Used from the outside to continue execution but
		 *   paying attention to whether it was already
		 *   paused or not before it was halted.
		 */
		resume: function() {
			if (this.$el.hasClass('playing'))
				this.updater.play();
		},

		update: function(delta) {


			// Test code
			this.graphics.rotation += (Math.PI / 8000) * delta;
			this.graphics.position.x += (200 / 1000) * delta * this.direction;

			if (this.graphics.position.x > 860)
				this.direction = -1;
			else if (this.graphics.position.x < 100)
				this.direction = 1;
			// End test code

			//console.log(this.model.get('title') + ' ' + delta);
			
			// Update the model
			this.waveSimulation.update(this.updater.total);

			// Render everything
			this.renderer.render(this.stage);
		}

	});

	return SimView;
});
