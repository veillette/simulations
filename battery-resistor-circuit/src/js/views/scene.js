define(function(require) {

    'use strict';

    var _    = require('underscore');
    var PIXI = require('pixi');

    var PixiSceneView      = require('common/v3/pixi/view/scene');
    var ModelViewTransform = require('common/math/model-view-transform');
    var Vector2            = require('common/math/vector2');

    var TurnstileView          = require('views/turnstile');
    var AmmeterView            = require('views/ammeter');
    var ResistorView           = require('views/resistor');
    var WirePatchView          = require('views/wire-patch');
    var BatteryView            = require('views/battery');
    var ElectronView           = require('views/electron');
    var SpectrumView           = require('views/spectrum');
    var VoltageCalculationView = require('views/voltage-calculation');

    var Assets = require('assets');

    // Constants
    var Constants = require('constants');

    // CSS
    require('less!styles/scene');

    /**
     *
     */
    var BRCSceneView = PixiSceneView.extend({

        events: {
            
        },

        initialize: function(options) {
            PixiSceneView.prototype.initialize.apply(this, arguments);
        },

        renderContent: function() {
            
        },

        initGraphics: function() {
            PixiSceneView.prototype.initGraphics.apply(this, arguments);

            this.bottomLayer   = new PIXI.Container();
            this.middleLayer   = new PIXI.Container();
            this.electronLayer = new PIXI.Container();
            this.topLayer      = new PIXI.Container();

            this.stage.addChild(this.bottomLayer);
            this.stage.addChild(this.middleLayer);
            this.stage.addChild(this.electronLayer);
            this.stage.addChild(this.topLayer);

            this.initMVT();
            this.initWires();
            this.initBatteryView();
            this.initTurnstileView();
            this.initAmmeterView();
            this.initResistorView();
            this.initSpectrumView();
            this.initElectronViews();
            this.initVoltageCalculationView();
        },

        initMVT: function() {
            // Map the simulation bounds...
            var simWidth  = Constants.SIM_WIDTH;
            var simHeight = Constants.SIM_HEIGHT;

            // ...to the usable screen space that we have
            var controlsWidth = 220;
            var margin = 20;
            var rightMargin = 0 + controlsWidth + margin;
            var usableWidth = this.width - rightMargin;
            var usableHeight = this.height - 62;

            var simRatio = simWidth / simHeight;
            var screenRatio = usableWidth / usableHeight;
            
            var scale = (screenRatio > simRatio) ? usableHeight / simHeight : usableWidth / simWidth;
            
            this.viewOriginX = (usableWidth - simWidth * scale) / 2; // Center it
            this.viewOriginY = 0;

            this.mvt = ModelViewTransform.createSinglePointScaleMapping(
                new Vector2(-Constants.SIM_X_OFFSET, 0),
                new Vector2(this.viewOriginX, this.viewOriginY),
                scale
            );
        },

        initWires: function() {
            this.leftWirePatchView = new WirePatchView({
                model: this.simulation.leftPatch,
                mvt: this.mvt
            });

            this.rightWirePatchView = new WirePatchView({
                model: this.simulation.rightPatch,
                mvt: this.mvt
            });

            this.bottomLayer.addChild(this.leftWirePatchView.displayObject);
            this.bottomLayer.addChild(this.rightWirePatchView.displayObject);
        },

        initBatteryView: function() {
            this.batteryView = new BatteryView({
                mvt: this.mvt,
                simulation: this.simulation
            });

            this.topLayer.addChild(this.batteryView.solidLayer);
            this.middleLayer.addChild(this.batteryView.cutawayLayer);
        },

        initTurnstileView: function() {
            this.turnstileView = new TurnstileView({
                mvt: this.mvt,
                model: this.simulation.turnstile
            });

            this.topLayer.addChild(this.turnstileView.displayObject);
        },

        initAmmeterView: function() {
            this.ammeterView = new AmmeterView({
                mvt: this.mvt,
                simulation: this.simulation
            });

            this.topLayer.addChild(this.ammeterView.displayObject);
        },

        initResistorView: function() {
            this.resistorView = new ResistorView({
                mvt: this.mvt,
                simulation: this.simulation
            });

            this.middleLayer.addChild(this.resistorView.displayObject);
            this.topLayer.addChild(this.resistorView.coresLayer);
        },

        initSpectrumView: function() {
            this.spectrumView = new SpectrumView({
                mvt: this.mvt,
                resistorView: this.resistorView
            });

            this.topLayer.addChild(this.spectrumView.displayObject);
        },

        initElectronViews: function() {
            this.electronViews = [];

            for (var i = 0; i < this.simulation.wireSystem.particles.length; i++) {
                var view = new ElectronView({
                    mvt: this.mvt,
                    model: this.simulation.wireSystem.particles[i],
                    batteryWirePatch: this.simulation.batteryWirePatch
                });
                this.electronViews.push(view);
                this.electronLayer.addChild(view.displayObject);
            }
        },

        initVoltageCalculationView: function() {
            this.voltageCalculationView = new VoltageCalculationView({
                mvt: this.mvt,
                simulation: this.simulation,
                width: this.width,
                height: this.height
            });
            this.voltageCalculationView.hide();

            this.topLayer.addChild(this.voltageCalculationView.displayObject);
        },

        _update: function(time, deltaTime, paused, timeScale) {
            if (this.simulation.updated()) {
                this.turnstileView.update();
                this.resistorView.update();
                this.voltageCalculationView.update();

                for (var i = 0; i < this.electronViews.length; i++)
                    this.electronViews[i].update(time, deltaTime, paused);
            }
        },

        showSolidBattery: function() {
            this.batteryView.showSolid();
        },

        showCutawayBattery: function() {
            this.batteryView.showCutaway();
        },

        showCores: function() {
            this.resistorView.showCores();
        },

        hideCores: function() {
            this.resistorView.hideCores();
        },

        showVoltageCalculation: function() {
            this.voltageCalculationView.show();
        },

        hideVoltageCalculation: function() {
            this.voltageCalculationView.hide();
        }

    });

    return BRCSceneView;
});
