define(function(require) {

    'use strict';

    var _    = require('underscore');
    var PIXI = require('pixi');

    var PixiSceneView      = require('common/v3/pixi/view/scene');
    var AppView            = require('common/v3/app/app');
    var ModelViewTransform = require('common/math/model-view-transform');
    var Vector2            = require('common/math/vector2');

    var ExternalFieldControlView = require('views/external-field-control');
    var ParticleView             = require('views/particle');

    var Assets = require('assets');

    // Constants
    var Constants = require('constants');

    // CSS
    require('less!styles/scene');

    /**
     *
     */
    var EFDSceneView = PixiSceneView.extend({

        events: {
            
        },

        initialize: function(options) {
            PixiSceneView.prototype.initialize.apply(this, arguments);

            this.listenTo(this.simulation.particles, 'reset',  this.particlesReset);
            this.listenTo(this.simulation.particles, 'add',    this.particleAdded);
            this.listenTo(this.simulation.particles, 'remove', this.particleRemoved);
        },

        renderContent: function() {
            
        },

        initGraphics: function() {
            PixiSceneView.prototype.initGraphics.apply(this, arguments);

            this.initMVT();
            this.initExternalFieldControlView();
            this.initParticles();
        },

        initMVT: function() {
            // Use whichever dimension is smaller
            var usableWidth = this.width - ExternalFieldControlView.PANEL_WIDTH - ExternalFieldControlView.RIGHT;
            var usableHeight = this.height - 62 - 8;

            if (AppView.windowIsShort())
                usableWidth -= ExternalFieldControlView.PANEL_WIDTH + ExternalFieldControlView.RIGHT;

            var scale;
            if (usableWidth < usableHeight)
                scale = usableWidth / Constants.SYSTEM_WIDTH;
            else
                scale = usableHeight / Constants.SYSTEM_WIDTH;

            if (AppView.windowIsShort()) {
                // Center between the two columns
                this.viewOriginX = Math.round(this.width / 2);
                this.viewOriginY = Math.round(usableHeight / 2);
            }
            else {
                // Center in the usable area on the left
                this.viewOriginX = Math.round(usableWidth / 2);
                this.viewOriginY = Math.round(usableHeight / 2);
            }

            this.mvt = ModelViewTransform.createSinglePointScaleMapping(
                new Vector2(0, 0),
                new Vector2(this.viewOriginX, this.viewOriginY),
                scale
            );
        },

        initExternalFieldControlView: function() {
            this.externalFieldControlView = new ExternalFieldControlView({
                mvt: this.mvt,
                model: this.simulation.fieldLaw,
                simulation: this.simulation
            });

            this.externalFieldControlView.displayObject.x = this.width  - ExternalFieldControlView.RIGHT;
            this.externalFieldControlView.displayObject.y = this.height - ExternalFieldControlView.BOTTOM;

            this.stage.addChild(this.externalFieldControlView.displayObject);
            this.$ui.append(this.externalFieldControlView.el);

            this.externalFieldControlView.$el.css({
                'top': (this.height - ExternalFieldControlView.BOTTOM - ExternalFieldControlView.PANEL_HEIGHT) + 'px'
            });
        },

        initParticles: function() {
            this.particleViews = [];

            this.particles = new PIXI.Container();

            this.stage.addChild(this.particles);
        },

        reset: function() {

        },

        _update: function(time, deltaTime, paused, timeScale) {
            
        },

        particlesReset: function(particles) {
            // Remove old particle views
            for (var i = this.particleViews.length - 1; i >= 0; i--) {
                this.particleViews[i].removeFrom(this.particles);
                this.particleViews.splice(i, 1);
            }

            // Add new particle views
            particles.each(function(particle) {
                this.createAndAddParticleView(particle);
            }, this);
        },

        particleAdded: function(particle, particles) {
            this.createAndAddParticleView(particle);
        },

        particleRemoved: function(particle, particles) {
            for (var i = this.particleViews.length - 1; i >= 0; i--) {
                if (this.particleViews[i].model === particle) {
                    this.particleViews[i].removeFrom(this.particles);
                    this.particleViews.splice(i, 1);
                    break;
                }
            }
        },

        createAndAddParticleView: function(particle) {
            var particleView = new ParticleView({ 
                model: particle,
                mvt: this.mvt,
                simulation: this.simulation
            });
            this.particles.addChild(particleView.displayObject);
            this.particleViews.push(particleView);
        }

    });

    return EFDSceneView;
});
