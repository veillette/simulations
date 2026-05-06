define(function(require) {

    'use strict';



    var RutherfordScatteringSceneView = require('rutherford-scattering/views/scene');
    var PlumPuddingView = require('rutherford-scattering/views/plum-pudding');

    // Constants
    /**
     *
     */
    var PlumPuddingSceneView = RutherfordScatteringSceneView.extend({
        initAtomView: function() {
            this.atomNodeView = new PlumPuddingView({
                mvt: this.mvt,
                particleMVT: this.particleMVT,
                model: this.simulation.atomNode,
                simulation: this.simulation,
                scale: this.scale,
                maskBox: this.spaceBoxView.maskBox
            });

            this.bottomLayer.addChild(this.atomNodeView.displayObject);
        }
    });

    return PlumPuddingSceneView;
});
