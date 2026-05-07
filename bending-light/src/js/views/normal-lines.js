import * as PIXI from 'pixi.js';
import 'common/v3/pixi/dash-to';
import PixiView from 'common/v3/pixi/view';


var NormalLinesView = PixiView.extend({

    /**
     * Overrides PixiView's initializeDisplayObject function
     */
    initializeDisplayObject: function() {
        this.displayObject = new PIXI.Graphics();
    },

    initialize: function(options) {
        this.simulation = options.simulation;

        this._dashStyle = [ 10, 10 ];

        this.updateMVT(options.mvt);
    },

    draw: function() {
        var graphics = this.displayObject;
        graphics.clear();
        graphics.lineStyle(1, 0x000000, 1);
        graphics.moveTo(0, 0);
        graphics.dashTo(200, 200, this._dashStyle);
    },

    /**
     * Updates the model-view-transform and anything that
     *   relies on it.
     */
    updateMVT: function(mvt) {
        this.mvt = mvt;

        this.draw();
    }

});

export default NormalLinesView;
