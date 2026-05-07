import _ from 'underscore';
import * as PIXI from 'pixi.js';
import Vector2 from 'common/math/vector2';
import Colors from 'common/colors/colors';
import ModelViewTransform from 'common/math/model-view-transform';
import PixiSceneView from 'common/v3/pixi/view/scene';
import AppView from 'common/v3/app/app';
import CannonView from 'views/cannon';
import TargetView from 'views/target';
import DavidView from 'views/david';
import TrajectoryView from 'views/trajectory';
import ProjectileView from 'views/projectile';
import TankShellView from 'views/projectile/tank-shell';
import GolfballView from 'views/projectile/golfball';
import BaseballView from 'views/projectile/baseball';
import BowlingballView from 'views/projectile/bowlingball';
import FootballView from 'views/projectile/football';
import PumpkinView from 'views/projectile/pumpkin';
import AdultHumanView from 'views/projectile/adult-human';
import PianoView from 'views/projectile/piano';
import BuickView from 'views/projectile/buick';
import Constants from 'constants';
import 'styles/scene.less';

var ProjectileViews = [
    TankShellView,
    GolfballView,
    BaseballView,
    BowlingballView,
    FootballView,
    PumpkinView,
    AdultHumanView,
    PianoView,
    BuickView
];


/**
 *
 */
var ProjectileMotionSceneView = PixiSceneView.extend({

    events: {

    },

    initialize: function(options) {
        PixiSceneView.prototype.initialize.apply(this, arguments);

        this.zoomScale = 27;

        this.listenTo(this.simulation, 'projectile-launched', this.projectileLaunched);
        this.listenTo(this.simulation, 'change:currentTrajectory',   this.trajectoryAdded);
    },

    /**
     * Renders
     */
    renderContent: function() {

    },

    initGraphics: function() {
        PixiSceneView.prototype.initGraphics.apply(this, arguments);

        this.viewOriginX = Math.round(this.width  * Constants.SceneView.ORIGIN_X_PERCENT);
        this.viewOriginY = Math.round(this.height * Constants.SceneView.ORIGIN_Y_PERCENT);

        this.initMVT();
        this.initLayers();
        this.initBackground();
        this.initCannon();
        this.initTrajectories();
        this.initProjectiles();
        this.initTarget();
        this.initDavid();
    },

    initMVT: function() {
        var additionalScale = !AppView.windowIsShort() ? 1 : 0.7;

        this.mvt = ModelViewTransform.createSinglePointScaleInvertedYMapping(
            new Vector2(0, 0),
            new Vector2(this.viewOriginX, this.viewOriginY),
            this.zoomScale * additionalScale // Scale, meters to pixels
        );
    },

    initLayers: function() {
        // Create layers
        this.backLayer       = new PIXI.Container();
        this.propLayer       = new PIXI.Container();
        this.trajectoryLayer = new PIXI.Container();
        this.projectileLayer = new PIXI.Container();

        this.stage.addChild(this.backLayer);
        this.stage.addChild(this.propLayer);
        this.stage.addChild(this.trajectoryLayer);
        this.stage.addChild(this.projectileLayer);
    },

    initBackground: function() {
        // Sky gradient is painted in the background by css, but we can
        // Create the ground
        var groundY = Math.round(this.height * 0.82);
        var ground = new PIXI.Graphics();
        ground.y = groundY;
        ground.beginFill(Colors.parseHex(Constants.SceneView.GROUND_COLOR), 1);
        ground.drawRect(0, 0, this.width, this.height  - groundY);
        ground.endFill();

        this.backLayer.addChild(ground);
    },

    initCannon: function() {
        var cannonView = new CannonView({
            model: this.simulation.cannon,
            mvt: this.mvt
        });
        this.cannonView = cannonView;
        this.propLayer.addChild(cannonView.displayObject);
    },

    initTrajectories: function() {
        this.trajectoryViews = [];
    },

    initProjectiles: function() {
        this.projectileViews = [];
    },

    initTarget: function() {
        this.targetView = new TargetView({
            model: this.simulation.target,
            mvt: this.mvt
        });
        this.backLayer.addChild(this.targetView.displayObject);
    },

    initDavid: function() {
        this.davidView = new DavidView({
            model: this.simulation.david,
            mvt: this.mvt
        });
        this.backLayer.addChild(this.davidView.displayObject);
    },

    projectileLaunched: function(projectile) {
        var projectileViewClass = ProjectileView;
        _.each(ProjectileViews, function(View) {
            if (projectile instanceof View.getModelClass()) {
                projectileViewClass = View;
                return false;
            }
        });

        var projectileView = new projectileViewClass({
            model: projectile,
            mvt: this.mvt
        });

        this.listenTo(projectile, 'destroy', function() {
            projectileView.removeFrom(this.projectileLayer);
            var index = _.indexOf(this.projectileViews, projectileView);
            this.projectileViews.splice(index, 0);
        });

        this.projectileViews.push(projectileView);
        this.projectileLayer.addChild(projectileView.displayObject);
    },

    trajectoryAdded: function(simulation, trajectory) {
        if (!trajectory)
            return;

        var trajectoryView = new TrajectoryView({
            model: trajectory,
            mvt: this.mvt
        });

        this.trajectoryViews.push(trajectoryView);
        this.trajectoryLayer.addChild(trajectoryView.displayObject);
    },

    _update: function(time, deltaTime, paused, timeScale) {
        this.cannonView.update(time, deltaTime, paused);
    },

    zoomIn: function() {
        var zoom = this.zoomScale * 1.5;
        if (zoom < Constants.SceneView.MAX_SCALE) {
            this.zoomScale = zoom;
            this.initMVT();
            this.updateMVTs();
        }
    },

    zoomOut: function() {
        var zoom = this.zoomScale / 1.5;
        if (zoom > Constants.SceneView.MIN_SCALE) {
            this.zoomScale = zoom;
            this.initMVT();
            this.updateMVTs();
        }
    },

    updateMVTs: function() {
        var mvt = this.mvt;

        this.cannonView.updateMVT(mvt);
        this.targetView.updateMVT(mvt);
        this.davidView.updateMVT(mvt);

        for (var i = this.projectileViews.length - 1; i >= 0; i--)
            this.projectileViews[i].updateMVT(mvt);

        for (var j = this.trajectoryViews.length - 1; j >= 0; j--)
            this.trajectoryViews[j].updateMVT(mvt);

        this.trigger('change:mvt', this, mvt);
    },

    clearShots: function() {
        var i;
        for (i = this.projectileViews.length - 1; i >= 0; i--) {
            this.projectileViews[i].removeFrom(this.projectileLayer);
            this.projectileViews.splice(i, 1);
        }

        for (i = this.trajectoryViews.length - 1; i >= 0; i--) {
            this.trajectoryViews[i].removeFrom(this.trajectoryLayer);
            this.trajectoryViews.splice(i, 1);
        }
    }

});

export default ProjectileMotionSceneView;
