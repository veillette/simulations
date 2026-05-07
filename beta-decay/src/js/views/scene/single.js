import AppView from 'common/v3/app/app';
import SingleNucleusDecayChart from 'views/nucleus-decay-chart/single';
import SingleNucleusSceneView from 'views/scene/single-nucleus';
import 'beta-decay/styles/scene.less';

/**
 *
 */
var SingleNucleusBetaDecaySceneView = SingleNucleusSceneView.extend({

    initialize: function(options) {
        SingleNucleusSceneView.prototype.initialize.apply(this, [options]);

    },

    initGraphics: function() {
        SingleNucleusSceneView.prototype.initGraphics.apply(this, arguments);

        this.initNucleusDecayChart();
    },

    initNucleusDecayChart: function() {
        this.nucleusDecayChart = new SingleNucleusDecayChart({
            simulation: this.simulation,
            width: this.getWidthBetweenPanels(),
            renderer: this.renderer
        });

        if (AppView.windowIsShort()) {
            this.nucleusDecayChart.displayObject.x = this.getLeftPadding() + 12;
            this.nucleusDecayChart.displayObject.y = 12;
        }
        else {
            this.nucleusDecayChart.displayObject.x = this.getLeftPadding() + 20;
            this.nucleusDecayChart.displayObject.y = 20;
        }

        this.stage.addChild(this.nucleusDecayChart.displayObject);
    },

    getTopPadding: function() {
        return 150;
    },

    _update: function(time, deltaTime, paused, timeScale) {
        SingleNucleusSceneView.prototype._update.apply(this, arguments);

        this.nucleusDecayChart.update(time, deltaTime, paused);
    }

});

export default SingleNucleusBetaDecaySceneView;
