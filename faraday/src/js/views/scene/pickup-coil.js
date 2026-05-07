import FaradaySceneView from 'views/scene';

// Constants

/**
 *
 */
var PickupCoilSceneView = FaradaySceneView.extend({

    initialize: function(options) {
        FaradaySceneView.prototype.initialize.apply(this, arguments);

        this.magnetModel = this.simulation.barMagnet;
    },

    initGraphics: function() {
        FaradaySceneView.prototype.initGraphics.apply(this, arguments);

        this.initCompass();
        this.initBarMagnet();
        this.initInsideBField();
        this.initPickupCoil();

        this.hideCompass();
    },

    reset: function() {
        FaradaySceneView.prototype.reset.apply(this, arguments);

        this.pickupCoilView.reset();
        this.hideCompass();
    },

    _update: function(time, deltaTime, paused, timeScale) {
        FaradaySceneView.prototype._update.apply(this, arguments);

        this.pickupCoilView.update(time, deltaTime, paused);
    }

});

export default PickupCoilSceneView;
