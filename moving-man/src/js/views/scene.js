define(function(require) {

	'use strict';

	var $        = require('jquery');
	var _        = require('underscore');
	var Backbone = require('backbone');

	var MovingManView = require('views/moving-man');

	// CSS
	require('less!styles/scene');

	// HTML
	var template = require('text!templates/scene.html');

	/**
	 * 
	 */
	var SceneView = Backbone.View.extend({

		template: _.template(template),
		tagName: 'div',
		className: 'scene-view',

		initialize: function(options) {

			// Default values
			options = _.extend({

			}, options);

			// Save options
			if (options.simulation)
				this.simulation = options.simulation;
			else
				throw 'SceneView requires a simulation model to render.';

			// Bind events
			$(window).bind('resize', $.proxy(this.windowResized, this));
		},

		/**
		 * Renders content and canvas for heatmap
		 */
		render: function() {
			this.$el.html(this.template());

			this.renderMovingView();

			return this;
		},

		/**
		 * Renders html container
		 */
		renderMovingView: function() {
			var $manContainer = this.$('.man-container');
			this.movingManView = new MovingManView({
				simulation: this.simulation,
				dragFrame: $manContainer[0]
			});
			this.movingManView.render();
			$manContainer.html(this.movingManView.el);
		},

		/**
		 * Called after every component on the page has rendered to make sure
		 *   things like widths and heights and offsets are correct.
		 */
		postRender: function() {},

		/**
		 *
		 */
		resize: function() {

		},

		/**
		 * Called on a window resize to resize the canvas
		 */
		windowResized: function(event) {
			this.resizeOnNextUpdate = true;
		},

		/**
		 * Responds to resize events and draws everything.
		 */
		update: function(time, delta) {
			if (this.resizeOnNextUpdate)
				this.resize();
		}
	});

	return SceneView;
});