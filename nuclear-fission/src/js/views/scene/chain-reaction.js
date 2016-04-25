define(function(require) {

    'use strict';

    var _    = require('underscore');
    var PIXI = require('pixi');

    var AppView            = require('common/v3/app/app');
    var ModelViewTransform = require('common/math/model-view-transform');
    var Vector2            = require('common/math/vector2');

    var Nucleon       = require('models/nucleon');
    var AlphaParticle = require('models/alpha-particle');
    var Electron      = require('models/electron');
    var Antineutrino  = require('models/antineutrino');

    var NucleonView          = require('views/nucleon');
    var ExplodingNucleusView = require('views/nucleus/exploding');

    var NeutronSourceView     = require('nuclear-fission/views/neutron-source');
    var ContainmentVesselView = require('nuclear-fission/views/containment-vessel');

    var NuclearPhysicsSceneView = require('views/scene');

    var REACTION_STATE_NO_REACTION_PRODUCTS_PRESENT = 0;
    var REACTION_STATE_REACTION_OR_ADJUSTMENT_IN_PROGRESS = 1;
    var REACTION_STATE_REACTION_COMPLETE = 2;

    /**
     *
     */
    var OneNucleusSceneView = NuclearPhysicsSceneView.extend({

        initialize: function(options) {
            this.showingLabels = true;
            this.particleViews = [];
            this.nucleusViews = [];

            NuclearPhysicsSceneView.prototype.initialize.apply(this, arguments);

            this.listenTo(this.simulation.neutronSource, 'neutron-generated', this.neutronGenerated);
            this.listenTo(this.simulation.freeNeutrons, 'destroy', this.neutronDestroyed);

            this.listenTo(this.simulation, 'nucleus-added',   this.nucleusAdded);
            this.listenTo(this.simulation, 'nucleus-removed', this.nucleusRemoved);
        },

        renderContent: function() {
            var self = this;
            this.$resetButton = $('<button class="btn btn-lg reset-nucleus-btn">Reset Nucleus</button>');
            this.$resetButton.on('click', function() {
                self.resetNucleus();
            });

            this.$ui.append(this.$resetButton);
        },

        reset: function() {
            
        },

        initMVT: function() {
            this.viewOriginX = this.getLeftPadding() + this.getAvailableWidth() / 2;
            this.viewOriginY = this.getTopPadding() + this.getAvailableHeight() / 2;

            var pixelsPerFemtometer = 3;

            // The center of the screen is actually (5, 5) in the original
            this.mvt = ModelViewTransform.createSinglePointScaleMapping(
                new Vector2(0, 0),
                new Vector2(this.viewOriginX, this.viewOriginY),
                pixelsPerFemtometer
            );
        },

        initGraphics: function() {
            NuclearPhysicsSceneView.prototype.initGraphics.apply(this, arguments);

            this.particlesLayer = new PIXI.Container();
            this.nucleusLayer = new PIXI.Container();

            this.stage.addChild(this.particlesLayer);
            this.stage.addChild(this.nucleusLayer);

            this.initMVT();
            this.initNeutronSourceView();
            this.initContainmentVesselView();
            this.initStartingNuclei();
        },

        initNeutronSourceView: function() {
            this.neutronSourceView = new NeutronSourceView({
                model: this.simulation.neutronSource,
                mvt: this.mvt,
                modelWidth: 52,
                rotationEnabled: true
            });

            this.stage.addChild(this.neutronSourceView.displayObject);
        },

        initContainmentVesselView: function() {
            this.containmentVesselView = new ContainmentVesselView({
                model: this.simulation.containmentVessel,
                mvt: this.mvt
            });

            this.stage.addChild(this.containmentVesselView.displayObject);
        },

        initStartingNuclei: function() {
            var i;

            for (i = 0; i < this.simulation.u235Nuclei.length; i++)
                this.nucleusAdded(this.simulation.u235Nuclei.at(i));

            for (i = 0; i < this.simulation.u238Nuclei.length; i++)
                this.nucleusAdded(this.simulation.u238Nuclei.at(i));
        },

        createParticleView: function(particle) {
            if (particle instanceof Nucleon) {
                // Add a visible representation of the nucleon to the canvas.
                return new NucleonView({
                    model: particle,
                    mvt: this.mvt
                });
            }
            else if (particle instanceof AlphaParticle) {
                // Add a visible representation of the alpha particle to the canvas.
                return new AlphaParticleView({
                    model: particle,
                    mvt: this.mvt
                });
            }
            else {
                // There is some unexpected object in the list of constituents
                //   of the nucleus.  This should never happen and should be
                //   debugged if it does.
                throw 'unexpected particle';
            }
        },

        _update: function(time, deltaTime, paused, timeScale) {
            NuclearPhysicsSceneView.prototype._update.apply(this, arguments);

            this.neutronSourceView.update(time, deltaTime, paused);
            this.containmentVesselView.update(time, deltaTime, paused);

            for (var i = 0; i < this.particleViews.length; i++)
                this.particleViews[i].update(time, deltaTime, paused);
        },

        resetNucleus: function() {
            this.simulation.reset();
        },

        neutronGenerated: function(neutron) {
            var nucleonView = this.createParticleView(neutron);
            this.particleViews.push(nucleonView);
            this.particlesLayer.addChild(nucleonView.displayObject);
        },

        neutronDestroyed: function(nucleon) {
            for (var i = 0; i < this.particleViews.length; i++) {
                if (this.particleViews[i].model === nucleon) {
                    this.particleViews[i].remove();
                    this.particleViews.splice(i, 1);
                    return;
                }
            }
        },

        nucleusAdded: function(nucleus) {
            var nucleusView = new ExplodingNucleusView({
                model: nucleus,
                mvt: this.mvt,
                renderer: this.renderer
            });

            this.nucleusViews.push(nucleusView);
            this.nucleusLayer.addChild(nucleusView.displayObject);
        },

        nucleusRemoved: function(nucleus) {
            for (var i = 0; i < this.nucleusViews.length; i++) {
                if (this.nucleusViews[i].model === nucleus) {
                    this.nucleusViews[i].remove();
                    this.nucleusViews.splice(i, 1);
                    return;
                }
            }
        }

    });

    return OneNucleusSceneView;
});
