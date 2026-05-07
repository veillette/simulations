import 'common/v3/pixi/dash-to';
import PixiToImage from 'common/v3/pixi/pixi-to-image';
import ModelViewTransform from 'common/math/model-view-transform';
import Vector2 from 'common/math/vector2';
import WaveSensor from 'models/wave-sensor';
import VelocitySensor from 'models/velocity-sensor';
import IntroSceneView from 'views/scene/intro';
import WaveSensorView from 'views/wave-sensor';
import VelocitySensorView from 'views/velocity-sensor';


// Constants

/**
 *
 */
var MoreToolsSceneView = IntroSceneView.extend({

    initialize: function(options) {
        IntroSceneView.prototype.initialize.apply(this, arguments);
    },

    initGraphics: function() {
        IntroSceneView.prototype.initGraphics.apply(this, arguments);

        this.initWaveSensorView();
        this.initVelocitySensorView();
    },

    initWaveSensorView: function() {
        this.waveSensorView = new WaveSensorView({
            model: this.simulation.waveSensor,
            simulation: this.simulation,
            mvt: this.mvt
        });
        this.waveSensorView.hide();

        this.topLayer.addChild(this.waveSensorView.displayObject);
    },

    initVelocitySensorView: function() {
        this.velocitySensorView = new VelocitySensorView({
            model: this.simulation.velocitySensor,
            mvt: this.mvt
        });
        this.velocitySensorView.hide();

        this.topLayer.addChild(this.velocitySensorView.displayObject);
    },

    getWaveSensorIcon: function() {
        var mvt = new ModelViewTransform.createSinglePointScaleMapping(new Vector2(0, 0), new Vector2(0, 0), 1);

        var waveSensor = new WaveSensor({
            probe1Position: new Vector2(-25, 0),
            probe2Position: new Vector2(-25, 40),
            bodyPosition:   new Vector2(25, 0)
        });

        var waveSensorView = new WaveSensorView({
            model: waveSensor,
            mvt: mvt
        });

        return PixiToImage.displayObjectToDataURI(waveSensorView.displayObject);
    },

    getVelocitySensorIcon: function() {
        var mvt = new ModelViewTransform.createSinglePointScaleMapping(new Vector2(0, 0), new Vector2(0, 0), 1);

        var velocitySensor = new VelocitySensor();

        var velocitySensorView = new VelocitySensorView({
            model: velocitySensor,
            mvt: mvt
        });

        return PixiToImage.displayObjectToDataURI(velocitySensorView.displayObject);
    },

    _update: function(time, deltaTime, paused, timeScale) {
        IntroSceneView.prototype._update.apply(this, arguments);

        if (!paused) {
            this.velocitySensorView.update(time, deltaTime);
            this.waveSensorView.update();
        }
    },

});

export default MoreToolsSceneView;
