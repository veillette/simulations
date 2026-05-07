import * as PIXI from 'pixi.js';
import 'common/v3/pixi/extensions';
import PixiView from 'common/v3/pixi/view';
import Colors from 'common/colors/colors';
import WavelengthColors from 'common/colors/wavelength';
import Rectangle from 'common/math/rectangle';
import PiecewiseCurve from 'common/math/piecewise-curve';

/**
 * Represents a semi-transparent beam of light coming out of a lamp
 *   instead of individual photons.
 */
var BeamCurtainView = PixiView.extend({

    /**
     * Overrides PixiView's initializeDisplayObject function
     */
    initializeDisplayObject: function() {
        this.displayObject = new PIXI.Graphics();
    },

    initialize: function(options) {
        this.mvt = options.mvt;

        this.listenTo(this.model, 'change:photonsPerSecond change:wavelength', this.draw);

        this.updateMVT(options.mvt);
    },

    draw: function() {
        // Determine the color
        var rgba = this.getColor();
        var color = Colors.rgbToHexInteger(rgba);
        var alpha = rgba.a;

        // Determine the bounds in view space
        var shape = this.mvt.modelToView(this.model.getBounds());

        // Draw it
        var graphics = this.displayObject;
        graphics.clear();
        graphics.beginFill(color, alpha);

        if (shape instanceof Rectangle)
            graphics.drawRect(shape.x, shape.y, shape.w, shape.h);
        else if (shape instanceof PiecewiseCurve)
            graphics.drawPiecewiseCurve(shape);

        graphics.endFill();
    },

    getColor: function() {
        var minLevel = 200;
        var colorMax = 255;
        var rate = this.model.get('photonsPerSecond') / this.model.get('maxPhotonsPerSecond');
        // The power function here controls the ramp-up of actualColor intensity
        var level = Math.max(minLevel, colorMax - Math.floor((colorMax - minLevel) * Math.pow(rate, 0.3)));
        var levelRgba = { r: level, g: level, b: level };

        // Get the wave color
        var waveRgb = WavelengthColors.nmToRgba(this.model.get('wavelength'), 1, true);
        // Our interpolation value is the color value of the wave as a percent
        var valuePercent = ((waveRgb.r + waveRgb.g + waveRgb.b) / 3) / 255;

        var finalColor = Colors.interpolateRgba(levelRgba, waveRgb, valuePercent);
        finalColor.a = (255 - level) / 255;

        return finalColor;
    },

    /**
     * Updates the model-view-transform and anything that relies on it.
     */
    updateMVT: function(mvt) {
        this.mvt = mvt;

        this.draw();
    }

});

export default BeamCurtainView;
