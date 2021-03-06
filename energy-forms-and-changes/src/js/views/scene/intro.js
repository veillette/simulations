define(function(require) {

    'use strict';

    //var $        = require('jquery');
    var _         = require('underscore');
    var PIXI      = require('pixi');
    var Vector2   = require('common/math/vector2');
    var Rectangle = require('common/math/rectangle');

    var ModelViewTransform = require('common/math/model-view-transform');
    var PixiSceneView      = require('common/v3/pixi/view/scene');
    var AppView            = require('common/v3/app/app');

    var Beaker = require('models/element/beaker');

    var AirView              = require('views/air');
    var ThermometerView      = require('views/element/thermometer');
    var ThermometerClipsView = require('views/thermometer-clips');
    var BlockView            = require('views/element/block');
    var BrickView            = require('views/element/brick');
    var BeakerView           = require('views/element/beaker');
    var BurnerStandView      = require('views/element/burner-stand');
    var BurnerView           = require('views/element/burner');
    var Assets               = require('assets');

    // Constants
    var Constants = require('constants');
    var IntroSimulationView = Constants.IntroSimulationView;

    /**
     *
     */
    var IntroSceneView = PixiSceneView.extend({

        events: {
            
        },

        initialize: function(options) {
            PixiSceneView.prototype.initialize.apply(this, arguments);

            this.views = [];
        },

        /**
         * Renders 
         */
        renderContent: function() {
            
        },

        initGraphics: function() {
            PixiSceneView.prototype.initGraphics.apply(this, arguments);

            var labBenchSurfaceTexture = Assets.Texture(Assets.Images.SHELF_LONG);

            var scale;
            if (AppView.windowIsShort())
                scale = 1400;
            else
                scale = 2000;

            this.viewOriginX = Math.round(this.width / 2);
            this.viewOriginY = Math.round(this.height - labBenchSurfaceTexture.height * 0.64); //Math.round(this.height * 0.85);//my failed attempt at making it less magic and more data-based
            
            this.mvt = ModelViewTransform.createSinglePointScaleInvertedYMapping(
                new Vector2(0, 0),
                new Vector2(this.viewOriginX, this.viewOriginY),
                scale
            );

            this.initLayers();
            this.initElements();
        },

        initLayers: function() {
            // Create layers
            this.backLayer        = new PIXI.Container();
            this.beakerBackLayer  = new PIXI.Container();
            this.blockLayer       = new PIXI.Container();
            this.airLayer         = new PIXI.Container();
            this.burnerFrontLayer = new PIXI.Container();
            this.thermometerLayer = new PIXI.Container();
            this.beakerFrontLayer = new PIXI.Container();

            this.stage.addChild(this.backLayer);
            this.stage.addChild(this.beakerBackLayer);
            this.stage.addChild(this.blockLayer);
            this.stage.addChild(this.airLayer);
            this.stage.addChild(this.burnerFrontLayer);
            this.stage.addChild(this.thermometerLayer);
            this.stage.addChild(this.beakerFrontLayer);
        },

        initElements: function() {
            // Lab bench surface
            this.initLabBenchSurface();

            // Air
            this.initAir();

            // Movable Elements
            this.initBlocks();
            this.initBeaker();

            // Thermometers
            this.initThermometers();

            // Burners
            this.initBurners();
        },

        initLabBenchSurface: function() {
            var labBenchSurfaceTexture = Assets.Texture(Assets.Images.SHELF_LONG);
            var labBenchSurface = new PIXI.Sprite(labBenchSurfaceTexture);
            labBenchSurface.anchor.y = 1;
            labBenchSurface.x = -(labBenchSurface.width - this.width) / 2;
            labBenchSurface.y = this.height;
            // labBenchSurface.x = this.mvt.modelToViewX(0) - labBenchSurfaceTexture.width / 2;
            // labBenchSurface.y = this.mvt.modelToViewY(0) - labBenchSurfaceTexture.height / 2 + 10;
            this.backLayer.addChild(labBenchSurface);
        },

        initAir: function() {
            var air = new AirView({ 
                model: this.simulation.air, 
                mvt: this.mvt
            });
            this.airLayer.addChild(air.displayObject);
            this.views.push(air);

            air.listenTo(this, 'show-energy-chunks', air.showEnergyChunks);
            air.listenTo(this, 'hide-energy-chunks', air.hideEnergyChunks);
            this.airView = air;
        },

        initBlocks: function() {
            var freeAreaAbove = 500;
            var movementConstraintBounds = new Rectangle(
                0, 
                0 - freeAreaAbove, 
                this.width, 
                this.viewOriginY + freeAreaAbove
            );
            var movementConstraint = _.bind(function(model, newPosition) {
                return this.simulation.validatePosition(model, newPosition);
            }, this);

            var lineWidth;
            var font;
            if (this.mvt.getXScale() > 1600) {
                lineWidth = Constants.BlockView.LINE_WIDTH;
                font = Constants.IntroElementView.TEXT_FONT;
            }
            else {
                lineWidth = Math.round(Constants.BlockView.LINE_WIDTH * (this.mvt.getXScale() / 2000));
                font = Constants.IntroElementView.SMALL_TEXT_FONT;
            } 

            this.brickView = new BrickView({ 
                model: this.simulation.brick,
                mvt: this.mvt,
                simulation: this.simulation,
                movementConstraintBounds: movementConstraintBounds,
                movementConstraint: movementConstraint,
                lineWidth: lineWidth,
                textColor: Constants.BrickView.TEXT_COLOR,
                textFont: font,
                labelText: 'Brick'
            });
            this.brickLayer = new PIXI.Container();
            this.brickLayer.addChild(this.brickView.debugLayer);
            this.brickLayer.addChild(this.brickView.energyChunkLayer);
            this.brickLayer.addChild(this.brickView.displayObject);
            this.blockLayer.addChild(this.brickLayer);
            
            this.ironBlockView = new BlockView({ 
                model: this.simulation.ironBlock, 
                mvt: this.mvt,
                simulation: this.simulation,
                movementConstraintBounds: movementConstraintBounds,
                movementConstraint: movementConstraint,
                lineWidth: lineWidth,
                fillColor: Constants.IronBlockView.FILL_COLOR,
                textColor: Constants.IronBlockView.TEXT_COLOR,
                textFont: font,
                labelText: 'Iron'
            });
            this.ironBlockLayer = new PIXI.Container();
            this.ironBlockLayer.addChild(this.ironBlockView.debugLayer);
            this.ironBlockLayer.addChild(this.ironBlockView.energyChunkLayer);
            this.ironBlockLayer.addChild(this.ironBlockView.displayObject);
            this.blockLayer.addChild(this.ironBlockLayer);

            this.views.push(this.brickView);
            this.views.push(this.ironBlockView);

            this.listenTo(this.simulation.brick,     'change:position', this.blockPositionChanged);
            this.listenTo(this.simulation.ironBlock, 'change:position', this.blockPositionChanged);

            // Listen to energy chunk show and hide events
            _.each([
                this.brickView,
                this.ironBlockView
            ], function(elementView) {
                elementView.listenTo(this, 'show-energy-chunks', elementView.showEnergyChunks);
                elementView.listenTo(this, 'hide-energy-chunks', elementView.hideEnergyChunks);
            }, this);
        },

        initBeaker: function() {
            var freeAreaAbove = 500;
            var movementConstraintBounds = new Rectangle(
                0, 
                0 - freeAreaAbove, 
                this.width, 
                this.viewOriginY + freeAreaAbove
            );
            var movementConstraint = _.bind(function(model, newPosition) {
                return this.simulation.validatePosition(model, newPosition);
            }, this);

            var lineWidth;
            if (this.mvt.getXScale() > 1600)
                lineWidth = Constants.BlockView.LINE_WIDTH;
            else
                lineWidth = Math.round(Constants.BlockView.LINE_WIDTH * (this.mvt.getXScale() / 2000));

            this.beakerView = new BeakerView({
                model: this.simulation.beaker,
                mvt: this.mvt,
                simulation: this.simulation,
                movable: true,
                movementConstraint: movementConstraint,
                movementConstraintBounds: movementConstraintBounds,
                lineWidth: lineWidth
            });
            this.views.push(this.beakerView);

            this.beakerFrontLayer.addChild(this.beakerView.frontLayer);
            this.beakerBackLayer.addChild(this.beakerView.backLayer);
            this.beakerBackLayer.addChild(this.beakerView.energyChunkLayer);
            this.beakerFrontLayer.addChild(this.beakerView.debugLayer);

            //this.beakerView.fluidMask.mask = this.ironBlockView.displayObject;

            this.beakerView.listenTo(this, 'show-energy-chunks', this.beakerView.showEnergyChunks);
            this.beakerView.listenTo(this, 'hide-energy-chunks', this.beakerView.hideEnergyChunks);

            this.listenTo(this.simulation.beaker, 'change:fluidLevel', this.fluidLevelChanged);
        },

        initThermometers: function() {
            var measurableElementViews = [
                this.brickView,
                this.ironBlockView,
                this.beakerView
            ];

            var thermometerViews = [];
            _.each(this.simulation.thermometers, function(thermometer) {
                var view = new ThermometerView({
                    model: thermometer,
                    mvt: this.mvt,
                    simulation: this.simulation,
                    measurableElementViews: measurableElementViews
                });
                thermometerViews.push(view);
                this.views.push(view);
            }, this);
            this.thermometerViews = thermometerViews;

            // Thermometer clips
            var thermometerClips = new ThermometerClipsView({
                mvt: this.mvt,
                x: Math.round(this.mvt.modelToViewDeltaX(0.01779)),
                y: Math.round(Math.abs(this.mvt.modelToViewDeltaY(0.0150))),
                numThermometerSpots: thermometerViews.length
            });
            this.thermometerClips = thermometerClips;
            this.backLayer.addChild(thermometerClips.displayObject);

            // Add thermometers to the thermometer clips
            _.each(thermometerViews, function(thermometerView) {
                var point = thermometerClips.addThermometer(thermometerView);
                thermometerView.setCenterPosition(point.x, point.y);

                var rect = new Rectangle();
                this.listenTo(thermometerView, 'drag-start', function() {
                    var removedView = thermometerClips.removeThermometer(thermometerView);
                    if (removedView) {
                        this.thermometerLayer.addChild(removedView.displayObject);
                        removedView.displayObject.x += thermometerClips.displayObject.x;
                        removedView.displayObject.y += thermometerClips.displayObject.y;
                    }
                });
                this.listenTo(thermometerView, 'drag-end', function() {
                    rect.set(
                        thermometerView.displayObject.x, 
                        thermometerView.displayObject.y - thermometerView.displayObject.height,
                        thermometerView.displayObject.width, 
                        thermometerView.displayObject.height
                    );
                    if (thermometerClips.overlaps(rect)) {
                        this.thermometerLayer.removeChild(thermometerView.displayObject);
                        var point = thermometerClips.addThermometerNear(thermometerView, thermometerView.displayObject.position);
                        thermometerView.setCenterPosition(point.x, point.y);
                    }
                });
            }, this);
        },

        initBurners: function() {
            var burnerWidth = this.mvt.modelToViewDeltaX(this.simulation.leftBurner.getOutlineRect().w);
            var burnerProjectionAmount = burnerWidth * Constants.Burner.EDGE_TO_HEIGHT_RATIO;
            burnerWidth *= IntroSimulationView.BURNER_WIDTH_SCALE;
            var burnerHeight = burnerWidth * IntroSimulationView.BURNER_HEIGHT_TO_WIDTH_RATIO;
            var burnerOpeningHeight = burnerHeight * 0.2;

            var leftBurnerStandView = new BurnerStandView({
                model: this.simulation.leftBurner,
                mvt: this.mvt,
                simulation: this.simulation,
                rectangle: this.mvt.modelToViewDelta(this.simulation.leftBurner.getRawOutlineRect()),
                projectedEdgeLength: burnerProjectionAmount
            });

            var rightBurnerStandView = new BurnerStandView({
                model: this.simulation.rightBurner,
                mvt: this.mvt,
                simulation: this.simulation,
                rectangle: this.mvt.modelToViewDelta(this.simulation.rightBurner.getRawOutlineRect()),
                projectedEdgeLength: burnerProjectionAmount
            });

            var font = (this.mvt.getXScale() > 1600) ? BurnerView.TEXT_FONT : BurnerView.SMALL_TEXT_FONT;

            var leftBurnerView = new BurnerView({
                model: this.simulation.leftBurner,
                mvt: this.mvt,
                simulation: this.simulation,
                width: burnerWidth,
                height: burnerHeight,
                openingHeight: burnerOpeningHeight,
                textFont: font,
                energyChunkCollection: this.simulation.leftBurner.energyChunkList
            });

            var rightBurnerView = new BurnerView({
                model: this.simulation.rightBurner,
                mvt: this.mvt,
                simulation: this.simulation,
                width: burnerWidth,
                height: burnerHeight,
                openingHeight: burnerOpeningHeight,
                textFont: font,
                energyChunkCollection: this.simulation.rightBurner.energyChunkList
            });

            this.views.push(leftBurnerStandView);
            this.views.push(rightBurnerStandView);
            this.views.push(leftBurnerView);
            this.views.push(rightBurnerView);

            this.backLayer.addChild(leftBurnerView.backLayer);
            this.backLayer.addChild(leftBurnerView.energyChunkLayer);
            this.burnerFrontLayer.addChild(leftBurnerView.frontLayer);

            this.backLayer.addChild(rightBurnerView.backLayer);
            this.backLayer.addChild(rightBurnerView.energyChunkLayer);
            this.burnerFrontLayer.addChild(rightBurnerView.frontLayer);

            this.backLayer.addChild(leftBurnerStandView.displayObject);
            this.backLayer.addChild(rightBurnerStandView.displayObject);

            _.each([
                leftBurnerView,
                rightBurnerView
            ], function(elementView) {
                elementView.listenTo(this, 'show-energy-chunks', elementView.showEnergyChunks);
                elementView.listenTo(this, 'hide-energy-chunks', elementView.hideEnergyChunks);
            }, this);
        },

        _update: function(time, deltaTime, paused, timeScale) {
            //if (!this.simulation.get('paused'))
            for (var i = 0; i < this.views.length; i++)
                this.views[i].update(time, deltaTime, paused, timeScale);
        },

        reset: function() {
            this.thermometerClips.removeThermometers();
            _.each(this.thermometerViews, function(view) {
                var point = this.thermometerClips.addThermometer(view);
                view.setCenterPosition(point.x, point.y);
            }, this);
        },

        blockPositionChanged: function() {
            var brick = this.simulation.brick;
            var iron  = this.simulation.ironBlock;

            if (this.blockLayer.getChildIndex(this.brickLayer) !== 0 && (
                    iron.isStackedUpon(brick) || (
                        iron.getRect().left()   >= brick.getRect().right() ||
                        iron.getRect().bottom() >= brick.getRect().top()
                    )
                )
            ) {
                this.blockLayer.swapChildren(this.brickLayer, this.ironBlockLayer);
            }
            else if (this.blockLayer.getChildIndex(this.ironBlockLayer) !== 0 && (
                    brick.isStackedUpon(iron) || (
                        brick.getRect().left()   >= iron.getRect().right() ||
                        brick.getRect().bottom() >= iron.getRect().top()
                    )
                )
            ) {
                this.blockLayer.swapChildren(this.brickLayer, this.ironBlockLayer);
            }
        },

        fluidLevelChanged: function(beaker, fluidLevel) {
            if (fluidLevel !== Beaker.INITIAL_FLUID_LEVEL) {
                // Move the beaker grabbing layer behind the block layer
                if (this.stage.getChildIndex(this.blockLayer) < this.stage.getChildIndex(this.beakerBackLayer))
                    this.stage.swapChildren(this.blockLayer, this.beakerBackLayer);
            }
            else {
                // Move the beaker grabbing layer in front of the block layer
                if (this.stage.getChildIndex(this.blockLayer) > this.stage.getChildIndex(this.beakerBackLayer))
                    this.stage.swapChildren(this.blockLayer, this.beakerBackLayer);
            }
        },

        showEnergyChunks: function() {
            this.trigger('show-energy-chunks');
        },

        hideEnergyChunks: function() {
            this.trigger('hide-energy-chunks');
        }

    });

    return IntroSceneView;
});
