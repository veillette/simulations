define(function(require) {

    'use strict';

    var $        = require('jquery');
    var _        = require('underscore');
    var Backbone = require('backbone');
    var PIXI     = require('pixi');
    var version = (PIXI.VERSION || '').replace(/^v/i, '');
    var majorVersion = parseInt(version.split('.')[0], 10);
    var useRendererOptionsObject = !isNaN(majorVersion) ? majorVersion >= 5 : !!PIXI.Renderer;
    var fallbackSceneWidth = 800;
    var fallbackSceneHeight = 600;
    var MAX_POST_RENDER_SIZE_ATTEMPTS = 20;

    /**
     * SceneView is the main focus of the app. 
     *
     */
    var PixiSceneView = Backbone.View.extend({
        getTargetSize: function() {
            var width = this.$el.width();
            var height = this.$el.height();
            var $parent = this.$el.parent();

            if (!width && $parent.length)
                width = $parent.width();
            if (!height && $parent.length)
                height = $parent.height();

            if (!width && this.renderer && this.renderer.width)
                width = this.renderer.width;
            if (!height && this.renderer && this.renderer.height)
                height = this.renderer.height;

            if (!width)
                width = fallbackSceneWidth;
            if (!height)
                height = fallbackSceneHeight;

            return {
                width: width,
                height: height
            };
        },


        tagName: 'canvas',
        className: 'scene-view',

        events: {
            
        },

        initialize: function(options) {
            // Save options
            if (options.simulation)
                this.simulation = options.simulation;
            else
                throw 'PixiSceneView requires a simulation model to render.';

            // Add a separate, disconnected element for hybrid views
            this.$ui = $('<div class="scene-view-ui">');
            this.ui = this.$ui[0];

            // Bind events
            $(window).bind('resize', $.proxy(this.windowResized, this));
        },

        /**
         * Renders content and canvas for heatmap
         */
        render: function() {
            this.renderContent();
            this.initRenderer();

            return this;
        },

        /**
         * Renders 
         */
        renderContent: function() {
            
        },

        /**
         * Called after every component on the page has rendered to make sure
         *   things like widths and heights and offsets are correct.
         */
        postRender: function() {
            this.ensureSizedAndInitGraphics(0);
        },

        ensureSizedAndInitGraphics: function(attempt) {
            var measuredWidth = this.$el.width();
            var measuredHeight = this.$el.height();
            var hasMeasuredSceneSize = measuredWidth > 1 && measuredHeight > 1;

            if (!hasMeasuredSceneSize && attempt < MAX_POST_RENDER_SIZE_ATTEMPTS) {
                setTimeout(_.bind(function() {
                    this.ensureSizedAndInitGraphics(attempt + 1);
                }, this), 0);
                return;
            }

            this.resize(true);
            this.initGraphics();
        },

        /**
         * Initializes a renderer
         */
        initRenderer: function() {
            var targetSize = this.getTargetSize();
            var width = targetSize.width;
            var height = targetSize.height;
            var options = {
                resolution: window.devicePixelRatio ? window.devicePixelRatio : 1,
                view: this.el,
                transparent: true,
                antialias: true
            };

            if (useRendererOptionsObject) {
                options.width = width;
                options.height = height;
                options.autoDensity = true;
                this.renderer = PIXI.autoDetectRenderer(options);
            } else {
                this.renderer = PIXI.autoDetectRenderer(width, height, options);
            }

            this.width  = width;
            this.height = height;

            // Create a stage to hold everything
            this.stage = new PIXI.Container();
        },

        initGraphics: function() {
            
        },

        /**
         * Called on a window resize to resize the canvas
         */
        windowResized: function(event) {
            this.resizeOnNextUpdate = true;
        },

        resize: function(override) {
            var targetSize = this.getTargetSize();
            var width = targetSize.width;
            var height = targetSize.height;
            this.width  = width;
            this.height = height;
            if (override || width != this.renderer.width || height != this.renderer.height) {
                this.resizeGraphics();
                this.trigger('resized');
            }
            this.resizeOnNextUpdate = false;

            this.offset = this.$el.offset();
        },

        resizeGraphics: function() {
            this.renderer.resize(this.width, this.height);
        },

        reset: function() {

        },

        update: function(time, deltaTime, paused, timeScale) {
            if (this.resizeOnNextUpdate)
                this.resize();

            this._update(time, deltaTime, paused, timeScale);

            // Render everything
            this.renderer.render(this.stage);
        },

        _update: function(time, deltaTime) {}

    });

    return PixiSceneView;
});
