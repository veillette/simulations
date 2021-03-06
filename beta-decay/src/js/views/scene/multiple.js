define(function(require) {

    'use strict';

    var _    = require('underscore');
    var PIXI = require('pixi');

    var AppView            = require('common/v3/app/app');
    var ModelViewTransform = require('common/math/model-view-transform');
    var Vector2            = require('common/math/vector2');
    var Rectangle          = require('common/math/rectangle');

    var Electron     = require('models/electron');
    var Antineutrino = require('models/antineutrino');

    var ParticleGraphicsGenerator     = require('views/particle-graphics-generator');
    var MultipleNucleusDecayChart     = require('views/nucleus-decay-chart/multiple');
    var NuclearPhysicsSceneView       = require('views/scene');
    var AtomCanisterView              = require('views/atom-canister');
    var DraggableExplodingNucleusView = require('views/nucleus/draggable');
    var ElectronView                  = require('views/electron');
    var AntineutrinoView              = require('views/antineutrino');

    var showNucleusPlacementDebuggingGraphics = false;

    /**
     *
     */
    var MultiNucleusBetaDecaySceneView = NuclearPhysicsSceneView.extend({

        initialize: function(options) {
            this.showingLabels = true;
            this.nucleusViews = [];
            this.particleViews = [];

            NuclearPhysicsSceneView.prototype.initialize.apply(this, arguments);

            this.listenTo(this.simulation.atomicNuclei, 'add',    this.nucleusAdded);
            this.listenTo(this.simulation.atomicNuclei, 'remove', this.nucleusRemoved);
            this.listenTo(this.simulation.atomicNuclei, 'reset',  this.nucleiReset);
            this.listenTo(this.simulation.emittedParticles, 'add',    this.particleEmitted);
            this.listenTo(this.simulation.emittedParticles, 'remove', this.particleRemoved);
            this.listenTo(this.simulation.emittedParticles, 'reset',  this.particlesReset);
        },

        renderContent: function() {
            var self = this;

            this.$resetButton = $('<button class="btn btn-lg reset-nuclei-btn">Reset All Nuclei</button>');
            this.$resetButton.on('click', function() {
                self.resetNuclei();
            });

            this.$add10Button = $('<button class="btn add-10-btn">+ 10</button>');
            this.$add10Button.on('click', function() {
                self.addTenNuclei();
            });

            this.$remove10Button = $('<button class="btn remove-10-btn">- 10</button>');
            this.$remove10Button.on('click', function() {
                self.removeTenNuclei();
            });

            this.$bucketButtonsWrapper = $('<div class="bucket-btns-wrapper">');
            this.$bucketButtonsWrapper.append(this.$add10Button);
            this.$bucketButtonsWrapper.append(this.$remove10Button);

            this.$ui.append(this.$resetButton);
            this.$ui.append(this.$bucketButtonsWrapper);

            this.updateAddRemoveButtons();
        },

        reset: function() {
            this.showLabels();
        },

        getTopPadding: function() {
            return 150;
        },

        initMVT: function() {
            var pixelsPerFemtometer;

            if (AppView.windowIsShort()) {
                pixelsPerFemtometer = 6;
            }
            else {
                pixelsPerFemtometer = 8;
            }

            this.viewOriginX = 0;
            this.viewOriginY = 0;

            // The center of the screen is actually (5, 5) in the original
            this.mvt = ModelViewTransform.createSinglePointScaleMapping(
                new Vector2(0, 0),
                new Vector2(this.viewOriginX, this.viewOriginY),
                pixelsPerFemtometer
            );

            this.simulation.setNucleusBounds(
                this.mvt.viewToModelX(this.getLeftPadding()),
                this.mvt.viewToModelY(this.getTopPadding()),
                this.mvt.viewToModelDeltaX(this.getAvailableWidth()),
                this.mvt.viewToModelDeltaY(this.getAvailableHeight())
            );

            if (showNucleusPlacementDebuggingGraphics) {
                var graphics = new PIXI.Graphics();
                graphics.beginFill(0xFF0000, 1);
                graphics.drawRect(this.getLeftPadding(), this.getTopPadding(), this.getAvailableWidth(), this.getAvailableHeight());
                graphics.endFill();
                this.stage.addChild(graphics);    
            }
        },

        initGraphics: function() {
            NuclearPhysicsSceneView.prototype.initGraphics.apply(this, arguments);

            this.canisterLayer = new PIXI.Container();
            this.nucleusLayer = new PIXI.Container();
            this.dummyLayer = new PIXI.Container();

            this.stage.addChild(this.canisterLayer);
            this.stage.addChild(this.nucleusLayer);

            this.initMVT();
            this.initNucleusDecayChart();
            this.initAtomCanister();

            this.stage.addChild(this.dummyLayer);
        },

        initNucleusDecayChart: function() {
            this.nucleusDecayChart = new MultipleNucleusDecayChart({
                simulation: this.simulation,
                width: this.getWidthBetweenPanels(),
                renderer: this.renderer
            });

            if (AppView.windowIsShort()) {
                this.nucleusDecayChart.displayObject.x = this.getLeftPadding() + 12;
                this.nucleusDecayChart.displayObject.y = 12;
            }
            else {
                this.nucleusDecayChart.displayObject.x = this.getLeftPadding() + 20;
                this.nucleusDecayChart.displayObject.y = 20;
            }

            this.stage.addChild(this.nucleusDecayChart.displayObject);
        },

        initAtomCanister: function() {
            var canisterX;
            var canisterY;
            var canisterWidth;

            if (AppView.windowIsShort()) {
                canisterX = 12 + 21;
                canisterY = 230;
                canisterWidth = 160;
            }
            else {
                canisterX = 534;
                canisterY = 440;
                canisterWidth = 160;
            }

            this.atomCanisterView = new AtomCanisterView({
                simulation: this.simulation,
                width: canisterWidth,
                mvt: this.mvt,
                dummyLayer: this.dummyLayer,
                renderer: this.renderer
            });

            this.atomCanisterView.displayObject.x = canisterX;
            this.atomCanisterView.displayObject.y = canisterY;

            // Position the bucket buttons underneath
            var top = this.atomCanisterView.displayObject.y + 140;
            this.$bucketButtonsWrapper.css('top', top + 'px');

            if (AppView.windowIsShort()) {
                var left = this.atomCanisterView.displayObject.x + this.atomCanisterView.width / 2;
                this.$bucketButtonsWrapper.css('left', left + 'px'); 
            }
            else {
                var right = this.width - this.atomCanisterView.displayObject.x - this.atomCanisterView.width / 2;
                this.$bucketButtonsWrapper.css('right', right + 'px');    
            }

            // Calculate the bounds of the areas to be avoided when placing atoms
            var buttonHeight = this.$bucketButtonsWrapper.find('button').height();
            var resetButtonPos = this.$resetButton.position();
            var bucketButtonsRect = new Rectangle(canisterX, top, this.atomCanisterView.width, buttonHeight);
            var resetButtonRect = new Rectangle(resetButtonPos.left, resetButtonPos.top, canisterWidth, 46);
            this.atomCanisterView.setAreasToAvoid([
                bucketButtonsRect,
                resetButtonRect
            ]);

            if (showNucleusPlacementDebuggingGraphics) {
                var graphics = new PIXI.Graphics();
                graphics.beginFill();
                for (var i = 0; i < this.atomCanisterView.modelAreasToAvoid.length; i++) {
                    var viewArea = this.mvt.modelToView(this.atomCanisterView.modelAreasToAvoid[i]);
                    graphics.drawRect(viewArea.x, viewArea.y, viewArea.w, viewArea.h);
                }
                graphics.endFill();
                this.stage.addChild(graphics);    
            }

            this.canisterLayer.addChild(this.atomCanisterView.displayObject);
        },

        _update: function(time, deltaTime, paused, timeScale) {
            NuclearPhysicsSceneView.prototype._update.apply(this, arguments);
            
            this.nucleusDecayChart.update(time, deltaTime, paused);
            this.atomCanisterView.update(time, deltaTime, paused);

            for (var i = 0; i < this.nucleusViews.length; i++)
                this.nucleusViews[i].update(time, deltaTime, paused);

            for (var i = 0; i < this.particleViews.length; i++)
                this.particleViews[i].update(time, deltaTime, paused);
        },

        nucleusAdded: function(nucleus) {
            var nucleusView = new DraggableExplodingNucleusView({
                model: nucleus,
                mvt: this.mvt,
                showSymbol: this.showingLabels,
                atomCanister: this.atomCanisterView,
                renderer: this.renderer
            });

            this.nucleusViews.push(nucleusView);

            this.nucleusLayer.addChild(nucleusView.displayObject);

            this.updateAddRemoveButtons();
        },

        nucleusRemoved: function(nucleus) {
            for (var i = 0; i < this.nucleusViews.length; i++) {
                if (this.nucleusViews[i].model == nucleus) {
                    this.nucleusViews[i].remove();
                    this.nucleusViews.splice(i, 1);
                    break;
                }
            }
            this.updateAddRemoveButtons();
        },

        nucleiReset: function() {
            for (var i = this.nucleusViews.length - 1; i >= 0; i--) {
                this.nucleusViews[i].remove();
                this.nucleusViews.splice(i, 1);
            }
            this.updateAddRemoveButtons();
        },

        particleEmitted: function(particle) {
            if (particle instanceof Electron) {
                var electronView = new ElectronView({
                    model: particle,
                    mvt: this.mvt
                });
                this.nucleusLayer.addChild(electronView.displayObject);
                this.particleViews.push(electronView);
            }
            else if (particle instanceof Antineutrino) {
                var antineutrinoView = new AntineutrinoView({
                    model: particle,
                    mvt: this.mvt
                });
                this.nucleusLayer.addChild(antineutrinoView.displayObject);
                this.particleViews.push(antineutrinoView);
            }
        },

        particleRemoved: function(particle) {
            for (var i = 0; i < this.particleViews.length; i++) {
                if (this.particleViews[i].model === particle) {
                    this.particleViews[i].remove();
                    this.particleViews.splice(i, 1);
                    return;
                }
            }
        },

        particlesReset: function() {
            for (var i = this.particleViews.length - 1; i >= 0; i--) {
                this.particleViews[i].remove();
                this.particleViews.splice(i, 1);
            }
        },

        updateAddRemoveButtons: function() {
            this.$add10Button.prop('disabled', (this.simulation.atomicNuclei.length >= this.simulation.get('maxNuclei')));
            this.$remove10Button.prop('disabled', (this.simulation.atomicNuclei.length === 0));
        },

        resetNuclei: function() {
            this.simulation.resetActiveAndDecayedNuclei();
        },

        addTenNuclei: function() {
            this.atomCanisterView.addAtoms(10);
            this.updateAddRemoveButtons();
        },

        removeTenNuclei: function() {
            this.atomCanisterView.removeAtoms(10);
            this.updateAddRemoveButtons();
        },

        showLabels: function() {
            for (var i = 0; i < this.nucleusViews.length; i++)
                this.nucleusViews[i].showLabel();
            this.showingLabels = true;
        },

        hideLabels: function() {
            for (var i = 0; i < this.nucleusViews.length; i++)
                this.nucleusViews[i].hideLabel();
            this.showingLabels = false;
        }

    });

    return MultiNucleusBetaDecaySceneView;
});
