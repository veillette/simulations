define(function(require) {

    'use strict';

    var _    = require('underscore');
    var PIXI = require('pixi');

    var PixiSceneView      = require('common/pixi/view/scene');
    var GridView           = require('common/pixi/view/grid');
    var ModelViewTransform = require('common/math/model-view-transform');
    var Vector2            = require('common/math/vector2');

    var Sun       = require('models/body/sun');
    var Planet    = require('models/body/planet');
    var Moon      = require('models/body/moon');
    var Satellite = require('models/body/satellite');

    var BodyView      = require('views/body');
    var SunView       = require('views/body/sun');
    var PlanetView    = require('views/body/planet');
    var MoonView      = require('views/body/moon');
    var SatelliteView = require('views/body/satellite');

    // Constants
    var Constants = require('constants');

    // CSS
    require('less!styles/scene');

    /**
     *
     */
    var GOSceneView = PixiSceneView.extend({

        events: {
            
        },

        initialize: function(options) {
            this.zoom = 1;

            PixiSceneView.prototype.initialize.apply(this, arguments);

            this.loadScenario(this.simulation.get('scenario'));

            this.listenTo(this.simulation.bodies, 'reset',  this.bodiesReset);
            this.listenTo(this.simulation.bodies, 'add',    this.bodyAdded);
            this.listenTo(this.simulation.bodies, 'remove', this.bodyRemoved);

            this.listenTo(this.simulation, 'change:scenario', this.scenarioChanged);
        },

        renderContent: function() {
            
        },

        initGraphics: function() {
            PixiSceneView.prototype.initGraphics.apply(this, arguments);

            this.viewOriginX = Math.round(this.width  / 2);
            this.viewOriginY = Math.round(this.height / 2);

            this.initMVT();
            this.initBodies();
            this.initGridView();
        },

        initMVT: function() {
            this.mvt = ModelViewTransform.createSinglePointScaleInvertedYMapping(
                new Vector2(this.modelOrigin.x, this.modelOrigin.y),
                new Vector2(this.viewOriginX, this.viewOriginY),
                this.zoom * Constants.SceneView.SCENE_SCALE
            );
        },

        initBodies: function() {
            this.bodyViews = [];
            this.bodyTraceViews = [];

            this.bodies = new PIXI.DisplayObjectContainer();
            this.stage.addChild(this.bodies);

            this.bodiesReset(this.simulation.bodies);
        },

        initGridView: function() {
            // this.gridView = new GridView({
            //     origin: new Vector2(this.width / 2, this.height / 2),
            //     bounds: new Rectangle(0, 0, this.width, this.height),
            //     gridSize: this.mvt.modelToViewDeltaX(Constants.SceneView.GRID_SIZE),
            //     lineColor: '#fff',
            //     lineAlpha: 0.1
            // });
            // this.gridView.hide();
            // this.stage.addChild(this.gridView.displayObject);
        },

        _update: function(time, deltaTime, paused, timeScale) {
            if (!paused) {
                // Update particles to match new lattice
                this.updateBodies(time, deltaTime);
            }
        },

        updateBodies: function(time, deltaTime) {
            
        },

        bodiesReset: function(bodies) {
            // Remove old body views
            for (var i = this.bodyViews.length - 1; i >= 0; i--) {
                this.bodyViews[i].removeFrom(this.bodies);
                this.bodyViews.splice(i, 1);
            }

            // Add new body views
            bodies.each(function(body) {
                this.createAndAddBodyView(body);
            }, this);
        },

        bodyAdded: function(body, bodies) {
            this.createAndAddBodyView(body);
        },

        bodyRemoved: function(body, bodies) {
            for (var i = this.bodyViews.length - 1; i >= 0; i--) {
                if (this.bodyViews[i].model === body) {
                    this.bodyViews[i].removeFrom(this.bodies);
                    this.bodyViews.splice(i, 1);
                    break;
                }
            }
        },

        createAndAddBodyView: function(body) {
            var constructor;
            if (body instanceof Sun)
                constructor = SunView;
            else if (body instanceof Planet)
                constructor = PlanetView;
            else if (body instanceof Moon)
                constructor = MoonView;
            else if (body instanceof Satellite)
                constructor = SatelliteView;
            else
                constructor = BodyView;

            var bodyView = new constructor({ 
                model: body,
                mvt: this.mvt,
                simulation: this.simulation
            });
            this.bodies.addChild(bodyView.displayObject);
            this.bodyViews.push(bodyView);

            // if (this.velocityArrowsVisible)
            //     bodyView.showVelocityArrow();
            // else
            //     bodyView.hideVelocityArrow();

            // if (this.momentumArrowsVisible)
            //     bodyView.showMomentumArrow();
            // else
            //     bodyView.hideMomentumArrow();

            // Trace view
            // var bodyTraceView = new BodyTraceView({
            //     model: body,
            //     mvt: this.mvt
            // });
            // this.bodyTraceLayer.addChild(bodyTraceView.displayObject);
            // this.bodyTraceViews.push(bodyTraceView);
        },

        scenarioChanged: function(simulation, scenario) {
            this.loadScenario(scenario);
            this.updateMVT();
        },

        loadScenario: function(scenario) {
            // Update zoom
            this.zoom = scenario.viewSettings.defaultZoom;
            this.maxZoom = this.zoom * 2;
            this.minZoom = this.zoom / 2;

            // Update model origin
            this.modelOrigin = scenario.viewSettings.origin;

            // bodies forceScale -> scenario.viewSettings.forceScale
        },

        updateMVT: function() {
            this.initMVT();

            for (var i = 0; i < this.bodyViews.length; i++)
                this.bodyViews[i].updateMVT(this.mvt);
        }

    });

    return GOSceneView;
});
