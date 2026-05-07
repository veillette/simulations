import CapacitorLabSceneView from 'views/scene';
import DielectricSceneView from 'views/scene/dielectric';

/**
 *
 */
var IntroSceneView = DielectricSceneView.extend({

    initEFieldDetector: function() {
        // We don't want the dielectric version of the e-field reader
        CapacitorLabSceneView.prototype.initEFieldDetector.apply(this, arguments);
    }

});

export default IntroSceneView;
