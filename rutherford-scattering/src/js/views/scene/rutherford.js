import RutherfordScatteringSceneView from 'rutherford-scattering/views/scene';
import AtomView from 'rutherford-scattering/views/atom';

// Constants
/**
 *
 */
var RutherfordAtomSceneView = RutherfordScatteringSceneView.extend({
    initAtomView: function() {
        this.atomNodeView = new AtomView({
            mvt: this.mvt,
            particleMVT: this.particleMVT,
            model: this.simulation.atomNode,
            simulation: this.simulation,
            scale: this.scale,
            maskBox: this.spaceBoxView.maskBox
        });

        this.bottomLayer.addChild(this.atomNodeView.displayObject);
    },

    _update: function(time, deltaTime, paused, timeScale) {
        RutherfordScatteringSceneView.prototype._update.call(this, arguments);
        this.atomNodeView._update(time, deltaTime, paused, timeScale);
    }
});

export default RutherfordAtomSceneView;
