import * as PIXI from 'pixi.js';
import PixiView from 'common/v3/pixi/view';
import Colors from 'common/colors/colors';
import Constants from 'constants';
var LINE_COLOR = Colors.parseHex(Constants.BallTraceView.LINE_COLOR);

var BallTraceView = PixiView.extend({

    initialize: function(options) {
        this.mvt = options.mvt;

        this.previousPoint = new PIXI.Point();
        this.previousPoint.x = this.mvt.modelToViewX(this.model.get('position').x);
        this.previousPoint.y = this.mvt.modelToViewY(this.model.get('position').y);

        this.initGraphics();
    },

    initGraphics: function() {
        this.trace = new PIXI.Graphics();
        this.trace.lineStyle(BallTraceView.LINE_WIDTH, LINE_COLOR, BallTraceView.LINE_ALPHA);

        this.displayObject.addChild(this.trace);

        this.updateMVT(this.mvt);
    },

    appendTracePoint: function() {
        var x = this.mvt.modelToViewX(this.model.get('position').x);
        var y = this.mvt.modelToViewY(this.model.get('position').y);

        this.trace.moveTo(this.previousPoint.x, this.previousPoint.y);
        this.trace.lineTo(x, y);

        this.previousPoint.x = x;
        this.previousPoint.y = y;
    },

    updateMVT: function(mvt) {
        this.mvt = mvt;

        this.clear();
    },

    update: function(time, deltaTime, simulationPaused) {
        if (!simulationPaused && !this.model.get('destroyedInCollision'))
            this.appendTracePoint();
    },

    clear: function() {
        this.trace.clear();
        this.trace.lineStyle(BallTraceView.LINE_WIDTH, LINE_COLOR, BallTraceView.LINE_ALPHA);
        this.previousPoint.x = this.mvt.modelToViewX(this.model.get('position').x);
        this.previousPoint.y = this.mvt.modelToViewY(this.model.get('position').y);
    }

}, Constants.BallTraceView);


export default BallTraceView;