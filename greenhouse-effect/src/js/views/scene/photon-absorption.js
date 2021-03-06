define(function(require) {

    'use strict';

    var _    = require('underscore');
    var PIXI = require('pixi');

    var PixiSceneView      = require('common/v3/pixi/view/scene');
    var ModelViewTransform = require('common/math/model-view-transform');
    var Rectangle          = require('common/math/rectangle');
    var Vector2            = require('common/math/vector2');

    var MoleculeView      = require('views/molecule');
    var PhotonView        = require('views/photon');
    var PhotonEmitterView = require('views/photon-emitter');

    var Assets = require('assets');

    // Constants
    var Constants = require('constants');

    // CSS
    require('less!styles/scene');

    /**
     *
     */
    var PhotonAbsorptionSceneView = PixiSceneView.extend({

        initialize: function(options) {
            PixiSceneView.prototype.initialize.apply(this, arguments);

            this.listenTo(this.simulation.molecules, 'reset',          this.moleculesReset);
            this.listenTo(this.simulation.molecules, 'add',            this.moleculeAdded);
            this.listenTo(this.simulation.molecules, 'remove destroy', this.moleculeRemoved);

            this.listenTo(this.simulation.photons, 'reset',          this.photonsReset);
            this.listenTo(this.simulation.photons, 'add',            this.photonAdded);
            this.listenTo(this.simulation.photons, 'remove destroy', this.photonRemoved);
        },

        renderContent: function() {
            
        },

        initGraphics: function() {
            this.initMVT();
            this.initContainmentBox();
            this.initMolecules();
            this.initPhotons();
            this.initPhotonEmitter();
        },

        initMVT: function() {
            // Map the simulation bounds...
            var bounds = Constants.PhotonAbsorptionSimulation.CONTAINMENT_AREA_RECT;

            // ...to the usable screen space that we have
            var controlsWidth = 180;
            var margin = 20;
            var leftMargin  = margin + controlsWidth + margin; // Need space for molecule cannon
            var rightMargin = margin + controlsWidth + margin;
            var topMargin = margin;
            var bottomMargin = margin;
            var usableScreenSpace = new Rectangle(
                leftMargin, 
                topMargin, 
                this.width - leftMargin - rightMargin, 
                this.height - topMargin - bottomMargin
            );

            var boundsRatio = bounds.w / bounds.h;
            var screenRatio = usableScreenSpace.w / usableScreenSpace.h;
            
            var scale = (screenRatio > boundsRatio) ? usableScreenSpace.h / bounds.h : usableScreenSpace.w / bounds.w;
            
            this.viewOriginX = Math.round(usableScreenSpace.x + usableScreenSpace.w / 2);
            this.viewOriginY = Math.round(usableScreenSpace.y + usableScreenSpace.h / 2);

            this.mvt = ModelViewTransform.createSinglePointScaleInvertedYMapping(
                new Vector2(0, 0),
                new Vector2(this.viewOriginX, this.viewOriginY),
                scale
            );
        },

        initContainmentBox: function() {
            var bounds = Constants.PhotonAbsorptionSimulation.CONTAINMENT_AREA_RECT;
            var viewBounds = this.mvt.modelToView(bounds);
            viewBounds.x = Math.round(viewBounds.x);
            viewBounds.y = Math.round(viewBounds.y - viewBounds.h);
            viewBounds.w = Math.round(viewBounds.w);
            viewBounds.h = Math.round(Math.abs(viewBounds.h));

            var graphics = new PIXI.Graphics();
            graphics.lineStyle(10, 0xA1C1D2, 0.5);
            graphics.drawRect(viewBounds.x, viewBounds.y, viewBounds.w, viewBounds.h);
            graphics.lineStyle(2, 0xFFFFFF, 0.6);
            graphics.drawRect(viewBounds.x, viewBounds.y, viewBounds.w, viewBounds.h);
            this.stage.addChild(graphics);
        },

        initMolecules: function() {
            this.moleculeViews = [];

            this.molecules = new PIXI.Container();
            this.stage.addChild(this.molecules);

            this.moleculesReset(this.simulation.molecules);
        },

        initPhotons: function() {
            this.photonViews = [];

            this.photons = new PIXI.Container();
            this.stage.addChild(this.photons);

            this.photonsReset(this.simulation.photons);
        },

        initPhotonEmitter: function() {
            this.photonEmitterView = new PhotonEmitterView({
                model: this.simulation,
                mvt: this.mvt
            });
            this.stage.addChild(this.photonEmitterView.displayObject);
        },

        reset: function() {
            this.photonEmitterView.reset();
        },

        _update: function(time, deltaTime, paused, timeScale) {
            
        },

        moleculeAdded: function(molecule, molecules) {
            this.createAndAddMoleculeView(molecule);
        },

        moleculeRemoved: function(molecule, molecules) {
            for (var i = this.moleculeViews.length - 1; i >= 0; i--) {
                if (this.moleculeViews[i].model === molecule) {
                    this.moleculeViews[i].removeFrom(this.molecules);
                    this.moleculeViews.splice(i, 1);
                    break;
                }
            }
        },

        moleculesReset: function(molecules) {
            // Remove old molecule views
            for (var i = this.moleculeViews.length - 1; i >= 0; i--) {
                this.moleculeViews[i].removeFrom(this.molecules);
                this.moleculeViews.splice(i, 1);
            }

            // Add new molecule views
            molecules.each(function(molecule) {
                this.createAndAddMoleculeView(molecule);
            }, this);
        },

        createAndAddMoleculeView: function(molecule) {
            var moleculeView = new MoleculeView({ 
                model: molecule,
                mvt: this.mvt
            });
            this.molecules.addChild(moleculeView.displayObject);
            this.moleculeViews.push(moleculeView);
        },

        photonAdded: function(photon, photons) {
            this.createAndAddPhotonView(photon);
        },

        photonRemoved: function(photon, photons) {
            for (var i = this.photonViews.length - 1; i >= 0; i--) {
                if (this.photonViews[i].model === photon) {
                    this.photonViews[i].removeFrom(this.photons);
                    this.photonViews.splice(i, 1);
                    break;
                }
            }
        },

        photonsReset: function(photons) {
            // Remove old photon views
            for (var i = this.photonViews.length - 1; i >= 0; i--) {
                this.photonViews[i].removeFrom(this.photons);
                this.photonViews.splice(i, 1);
            }

            // Add new photon views
            photons.each(function(photon) {
                this.createAndAddPhotonView(photon);
            }, this);
        },

        createAndAddPhotonView: function(photon) {
            var photonView = new PhotonView({ 
                model: photon,
                mvt: this.mvt,
                modelDiameter: 100
            });
            this.photons.addChild(photonView.displayObject);
            this.photonViews.push(photonView);
        },

    });

    return PhotonAbsorptionSceneView;
});
