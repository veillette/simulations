define(function(require) {

    'use strict';

    var PIXI = require('pixi');

    var PixiView = require('common/v3/pixi/view');
    var Colors   = require('common/colors/colors');

    var Assets = require('assets');

    var Constants = require('constants');
    var MARKER_COLOR = Colors.parseHex(Constants.SpectrumView.MARKER_COLOR);

    /**
     * A view that represents an electron
     */
    var SpectrumView = PixiView.extend({

        /**
         * Initializes the new SpectrumView.
         */
        initialize: function(options) {
            this.mvt = options.mvt;
            this.resistorView = options.resistorView;

            this.initGraphics();

            this.listenTo(this.resistorView, 'powerChanged', this.powerChanged);
        },

        /**
         * Initializes everything for rendering graphics
         */
        initGraphics: function() {
            this.spectrum = Assets.createSprite(Assets.Images.SPECTRUM);
            this.labels = new PIXI.Container();
            this.marker = new PIXI.Graphics();

            this.displayObject.addChild(this.spectrum);
            this.displayObject.addChild(this.labels);
            this.displayObject.addChild(this.marker);

            this.initLabels();
            this.initMarker();

            this.updateMVT(this.mvt);
        },

        initLabels: function() {
            var margin = 10;
            var font = '12px Helvetica Neue';

            var cold = new PIXI.Text('cold', {
                font: font,
                fill: '#fff'
            });

            var hot = new PIXI.Text('hot', {
                font: font,
                fill: '#000'
            });

            hot.resolution = cold.resolution = this.getResolution();
            hot.anchor.x = 1;
            hot.anchor.y = cold.anchor.y = 0.5;

            this.labels.addChild(cold);
            this.labels.addChild(hot);

            this.cold = cold;
            this.hot = hot;
        },

        initMarker: function() {
            var height = Math.floor(this.spectrum.height * 0.5);
            var width = Math.floor(height * 1.2);
            var graphics = this.marker;

            graphics.y = this.spectrum.height;
            graphics.beginFill(MARKER_COLOR, 1);
            graphics.moveTo(0, 0);
            graphics.lineTo( width / 2, height);
            graphics.lineTo(-width / 2, height);
            graphics.endFill();
        },

        /**
         * Updates the model-view-transform and anything that
         *   relies on it.
         */
        updateMVT: function(mvt) {
            this.mvt = mvt;

            var $bottomPanel = $('.sim-controls-wrapper').children().last();
            var $sceneView   = $('.scene-view');

            var panelWidth  = $bottomPanel.innerWidth();
            var panelHeight = $bottomPanel.innerHeight();

            var panelX = $bottomPanel.offset().left - $sceneView.offset().left;
            var panelY = $bottomPanel.offset().top  - $sceneView.offset().top;

            var scale = panelWidth / this.spectrum.texture.width;
            this.spectrum.scale.x = scale;

            this.displayObject.x = Math.floor(panelX);
            this.displayObject.y = Math.floor(panelY + panelHeight + parseInt($bottomPanel.css('margin-bottom')));

            var margin = 10;
            this.cold.x = margin;
            this.cold.y = this.hot.y = Math.round(this.spectrum.height / 2);
            this.hot.x = this.spectrum.width - margin;

            this.update();
        },

        update: function() {
            
        },

        powerChanged: function(powerPercent) {
            this.marker.x = powerPercent * this.spectrum.width;
        }

    }, Constants.SpectrumView);


    return SpectrumView;
});