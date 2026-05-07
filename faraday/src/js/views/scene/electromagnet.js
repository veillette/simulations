import FaradaySceneView from 'views/scene';
import ElectromagnetView from 'views/electromagnet';



// Constants

/**
 *
 */
var ElectromagnetSceneView = FaradaySceneView.extend({

    initialize: function(options) {
        FaradaySceneView.prototype.initialize.apply(this, arguments);

        this.magnetModel = this.simulation.electromagnet;
    },

    reset: function() {
        FaradaySceneView.prototype.reset.apply(this, arguments);

        this.electromagnetView.reset();
    },

    initGraphics: function() {
        FaradaySceneView.prototype.initGraphics.apply(this, arguments);

        this.initCompass();
        this.initFieldMeter();
        this.initElectromagnet();
    },

    initElectromagnet: function() {
        this.electromagnetView = new ElectromagnetView({
            mvt: this.mvt,
            model: this.simulation.electromagnet,
            simulation: this.simulation
        });

        this.bottomLayer.addChild(this.electromagnetView.backgroundLayer);
        this.topLayer.addChild(this.electromagnetView.foregroundLayer);
    },

    _update: function(time, deltaTime, paused, timeScale) {
        FaradaySceneView.prototype._update.apply(this, arguments);

        this.electromagnetView.update(time, deltaTime, paused);
    },

    showElectromagnetElectrons: function() {
        this.electromagnetView.showElectrons();
    },

    hideElectromagnetElectrons: function() {
        this.electromagnetView.hideElectrons();
    }

});

export default ElectromagnetSceneView;
