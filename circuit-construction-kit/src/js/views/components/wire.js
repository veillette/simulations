define(function(require) {

    'use strict';

    var _    = require('underscore');
    var PIXI = require('pixi');
    
    var PixiView    = require('common/v3/pixi/view');
    var PixiToImage = require('common/v3/pixi/pixi-to-image');
    var Colors      = require('common/colors/colors');
    var Vector2     = require('common/math/vector2');

    var ComponentView = require('views/component');

    var Constants = require('constants');

    /**
     * A view that represents an atom
     */
    var WireView = ComponentView.extend({

        /**
         * Overrides PixiView's initializeDisplayObject function
         */
        initializeDisplayObject: function() {
            this.displayObject = new PIXI.Graphics();
        },

        /**
         * Initializes the new WireView.
         */
        initialize: function(options) {
            this.wireColor = Colors.parseHex(WireView.WIRE_COLOR);
            this.endColor  = Colors.parseHex(WireView.END_COLOR);

            // Cached objects
            this._start     = new Vector2();
            this._end       = new Vector2();
            this._direction = new Vector2();

            ComponentView.prototype.initialize.apply(this, [options]);
        },

        initComponentGraphics: function() {
            var points = [];
            for (var i = 0; i < 4; i++)
                points.push(new PIXI.Point());

            this.displayObject.hitArea = new PIXI.Polygon(points);
            this.displayObject.buttonMode = true;
            this.displayObject.defaultCursor = 'move';
        },

        initHoverGraphics: function() {
            this.hoverGraphics = new PIXI.Graphics();
            this.hoverLayer.addChild(this.hoverGraphics);
        },

        updateLabel: function() {},

        /**
         * Draws the wire patch
         */
        draw: function() {
            var radius = Math.round(this.mvt.modelToViewDeltaX(WireView.WIRE_WIDTH) / 2);
            var width;
            var wireColor;
            var endRadius;
            var endColor;

            if (this.circuit.get('schematic')) {
                width = Math.round(this.mvt.modelToViewDeltaX(WireView.SCHEMATIC_WIRE_WIDTH) / 2);
                wireColor = 0x000000;
                endRadius = width;
                endColor = wireColor;
            }
            else {
                width = radius * 2;
                wireColor = this.wireColor;
                endRadius = radius;
                endColor = this.endColor;
            }
            
            var point;
            point = this.mvt.modelToView(this.model.get('startJunction').get('position'));
            var x0 = point.x;
            var y0 = point.y;
            point = this.mvt.modelToView(this.model.get('endJunction').get('position'));
            var x1 = point.x;
            var y1 = point.y;

            // Draw the base lines
            var graphics = this.displayObject;
            graphics.clear();
            graphics.lineStyle(width, wireColor, 1);
            graphics.moveTo(x0, y0);
            graphics.lineTo(x1, y1);

            // Then round the edges by drawing circles over the connection points
            graphics.lineStyle(0, 0, 0);
            graphics.beginFill(endColor, 1);
            graphics.drawCircle(x0, y0, endRadius);
            graphics.drawCircle(x1, y1, endRadius);
            graphics.endFill();

            // Update the hit area
            var direction = this._direction.set(x1, y1).sub(x0, y0).normalize().scale(radius);

            var points = this.displayObject.hitArea.points;
            points[0] = x0 - direction.y;
            points[1] = y0 + direction.x;
            points[2] = x1 - direction.y;
            points[3] = y1 + direction.x;
            points[4] = x1 + direction.y;
            points[5] = y1 - direction.x;
            points[6] = x0 + direction.y;
            points[7] = y0 - direction.x;

            // Update the hover graphics
            graphics = this.hoverGraphics;
            graphics.clear();
            graphics.lineStyle(width, this.selectionColor, 1);
            graphics.moveTo(x0, y0);
            graphics.lineTo(x1, y1);
            graphics.lineStyle(0, 0, 0);
            graphics.beginFill(this.selectionColor, 1);
            graphics.drawCircle(x0, y0, radius);
            graphics.drawCircle(x1, y1, radius);
            graphics.endFill();

            var center = this.getCenter();
            this.helpLayer.x = center.x;
            this.helpLayer.y = center.y;
        },

        junctionsChanged: function() {
            this.draw();
        },

        /**
         * Updates the model-view-transform and anything that
         *   relies on it.
         */
        updateMVT: function(mvt) {
            ComponentView.prototype.updateMVT.apply(this, arguments);

            this.draw();
        },

        generateTexture: function() {
            return this.displayObject.generateTexture();
            var container = new PIXI.Container();
            container.addChild(this.displayObject);
            container.addChild(this.junctionLayer);
            // var graphics = new PIXI.Graphics();
            // graphics.lineStyle(10, 0, 1);
            // graphics.moveTo(-20, -20);
            // graphics.lineTo(20, 20);
            // graphics.lineTo(-20, 20);
            // graphics.lineTo(20, -20);
            // container.addChild(graphics);
            var texture = PixiToImage.displayObjectToTexture(container);
            // container.removeChild(this.displayObject);
            // container.removeChild(this.junctionLayer);
            return texture;
        },

        schematicModeChanged: function(circuit, schematic) {
            this.draw();
        }

    }, Constants.WireView);

    return WireView;
});