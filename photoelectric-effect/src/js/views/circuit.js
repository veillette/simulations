define(function(require) {

    'use strict';

    var $          = require('jquery');
    var PIXI       = require('pixi');
    var NoUiSlider = require('nouislider');

    var PixiView = require('common/v3/pixi/view');
    var Colors   = require('common/colors/colors');
    
    var DischargeLampsConstants = require('discharge-lamps/constants');

    var TargetMaterials = require('models/target-materials');

    var BatteryView = require('views/battery');

    var Assets    = require('assets');
    var Constants = require('constants');


    var CircuitView = PixiView.extend({
        events: {},

        initialize: function(options) {
            this.mvt = options.mvt;
            this.simulation = options.simulation;

            this.initGraphics();
        },

        initGraphics: function() {
            this.wires = Assets.createSprite(Assets.Images.WIRES);
            this.wires.anchor.x = 0.5;

            this.leftElectrode  = Assets.createSprite(Assets.Images.ELECTRODE);
            this.rightElectrode = Assets.createSprite(Assets.Images.ELECTRODE);

            this.leftElectrode.anchor.x = 1;
            this.rightElectrode.anchor.x = 0;
            this.leftElectrode.anchor.y = this.rightElectrode.anchor.y = 0.5;

            this.displayObject.addChild(this.wires);
            this.displayObject.addChild(this.leftElectrode);
            this.displayObject.addChild(this.rightElectrode);

            this.initBattery();
            this.initAmmeter();
            this.initTargetMaterial();

            this.updateMVT(this.mvt);
        },

        initBattery: function() {
            this.batteryView = new BatteryView({
                model: this.simulation.battery,
                mvt: this.mvt
            });

            this.displayObject.addChild(this.batteryView.displayObject);
        },

        initAmmeter: function() {
            this.ammeter = new PIXI.Container();

            var width = 120;
            var height = 40;
            var padding = 6;
            var panel = new PIXI.Graphics();

            panel.beginFill(0xBBBBBB, 1);
            panel.drawRect(0, 0, width, height);
            panel.endFill();

            panel.beginFill(0x222222, 1);
            panel.drawRect(padding, padding, width - padding * 2, height - padding * 2);
            panel.endFill();

            var textSettings = {
                font: '13px Helvetica Neue',
                fill: '#fff'
            };

            var currentLabel = new PIXI.Text('Current:', textSettings);
            var currentValue = new PIXI.Text('0.000',    textSettings);
            currentLabel.resolution = currentValue.resolution = this.getResolution();
            currentLabel.y = currentValue.y = panel.height / 2;
            currentLabel.x = padding * 2;
            currentValue.x = width - padding * 2;
            currentValue.anchor.y = currentLabel.anchor.y = 0.5;
            currentValue.anchor.x = 1;
            this.currentValue = currentValue;

            this.ammeter.addChild(panel);
            this.ammeter.addChild(currentLabel);
            this.ammeter.addChild(currentValue);

            this.displayObject.addChild(this.ammeter);

            this.listenTo(this.simulation, 'change:current', this.updateCurrent);
            this.listenTo(this.simulation.target, 'change:targetMaterial', this.updateTargetMaterialGraphics);
        },

        initTargetMaterial: function() {
            // Add a layer on top of the electrode to represent the target material
            this.targetMaterialGraphics = new PIXI.Graphics();
            this.displayObject.addChild(this.targetMaterialGraphics);
        },

        /**
         * Updates the model-view-transform and anything that relies on it.
         */
        updateMVT: function(mvt) {
            this.mvt = mvt;

            this.updateWireGraphics();
            this.updateElectrodeGraphics();
            this.updateTargetMaterialGraphics();

            this.batteryView.setPosition(0, this.wires.height - this.wireWidth / 2);
            this.batteryView.updateMVT(mvt);

            this.ammeter.x = mvt.modelToViewDeltaX(130);
            this.ammeter.y = this.wires.height - this.wireWidth / 2 - this.ammeter.height / 2;

            this.updatePosition();
        },

        updateWireGraphics: function() {
            var electrodeGapImagePercent = (1120 / 1600);
            var targetWidth = this.getElectrodeGap() / electrodeGapImagePercent;
            var wireGraphicScale = targetWidth / this.wires.texture.width;

            this.wires.scale.x = wireGraphicScale;
            this.wires.scale.y = wireGraphicScale;

            this.wireWidth = this.wires.height * (42 / 548);
        },

        updateElectrodeGraphics: function() {
            var targetElectrodeHeight = this.mvt.modelToViewDeltaX(DischargeLampsConstants.CATHODE_LENGTH);
            var electrodeScale = targetElectrodeHeight / this.leftElectrode.texture.height;

            this.leftElectrode.scale.x  = electrodeScale;
            this.leftElectrode.scale.y  = electrodeScale;
            this.rightElectrode.scale.x = electrodeScale;
            this.rightElectrode.scale.y = electrodeScale;

            var gap = this.getElectrodeGap();
            this.leftElectrode.x = -gap / 2;
            this.rightElectrode.x = gap / 2;

            this.leftElectrode.y = this.rightElectrode.y = this.wireWidth / 2;
        },

        updateTargetMaterialGraphics: function() {
            var graphics = this.targetMaterialGraphics;

            var gap = this.getElectrodeGap();
            graphics.x = -gap / 2;
            graphics.y = this.leftElectrode.y;

            graphics.clear();

            var offsetY   = this.mvt.modelToViewDeltaY(10);
            var thickness = this.mvt.modelToViewDeltaX(7);
            var height = this.leftElectrode.height - offsetY * 2;
            var color = Colors.parseHex(TargetMaterials.getColor(this.simulation.target.getMaterial()));
            graphics.beginFill(color, 1);
            graphics.drawRect(0, -height / 2, thickness, height);
            graphics.endFill();
        },

        updatePosition: function() {
            // Use the cathode position as our point of reference for positioning the whole circuit
            var cathodeViewPosition = this.mvt.modelToView(DischargeLampsConstants.CATHODE_LOCATION);
            this.displayObject.x = cathodeViewPosition.x - this.leftElectrode.x;
            this.displayObject.y = cathodeViewPosition.y - this.leftElectrode.y;
        },

        updateCurrent: function(simulation, current) {
            this.currentValue.text = current.toFixed(3);
        },

        getElectrodeGap: function() {
            var modelElectrodeGap = DischargeLampsConstants.ANODE_X_LOCATION - DischargeLampsConstants.CATHODE_X_LOCATION;
            var viewElectrodeGap = this.mvt.modelToViewDeltaX(modelElectrodeGap);
            return viewElectrodeGap;
        }

    }, Constants.CircuitView);

    return CircuitView;
});