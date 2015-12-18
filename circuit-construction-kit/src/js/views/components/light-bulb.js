define(function(require) {

    'use strict';

    var PIXI = require('pixi');
    
    var PixiToImage = require('common/v3/pixi/pixi-to-image');
    var Vector2     = require('common/math/vector2');

    var ComponentView = require('views/component');

    var Constants = require('constants');
    var Assets    = require('assets');

    /**
     * A view that represents a resistor
     */
    var LightBulbView = ComponentView.extend({

        contextMenuContent: 
            '<li><a class="change-resistance-btn"><span class="fa fa-bolt"></span>&nbsp; Change Resistance</a></li>' +
            '<li><a class="flip-btn"><span class="fa fa-arrows-h"></span>&nbsp; Show Connection at Left</a></li>' +
            '<li><a class="show-value-btn"><span class="fa fa-square-o"></span>&nbsp; Show Value</a></li>' +
            '<hr>' +
            ComponentView.prototype.contextMenuContent,

        /**
         * Initializes the new LightBulbView.
         */
        initialize: function(options) {
            // Cached objects
            this._vec = new Vector2();

            this.defaultOffsetLengthToWidthRatio = 

            ComponentView.prototype.initialize.apply(this, [options]);
        },

        initComponentGraphics: function() {
            this.offSprite = Assets.createSprite(Assets.Images.BULB_OFF);
            this.onSprite  = Assets.createSprite(Assets.Images.BULB_ON);
            this.offSprite.anchor.x = this.onSprite.anchor.x = 0.5;
            this.offSprite.anchor.y = this.onSprite.anchor.y = 1;
            this.onSprite.alpha = 0;
            this.displayObject.addChild(this.offSprite);
            this.displayObject.addChild(this.onSprite);
            
            this.displayObject.buttonMode = true;
            this.displayObject.defaultCursor = 'move';
        },

        initHoverGraphics: function() {
            var mask = Assets.createSprite(Assets.Images.BULB_MASK);
            mask.anchor.x = 0.5;
            mask.anchor.y = 1;

            var bounds = mask.getLocalBounds();
            var hoverGraphics = new PIXI.Graphics();
            hoverGraphics.beginFill(this.selectionColor, 1);
            hoverGraphics.drawRect(bounds.x - 4, bounds.y - 4, bounds.width + 8, bounds.height + 8);
            hoverGraphics.endFill();
            hoverGraphics.mask = mask;

            this.hoverLayer.addChild(mask);
            this.hoverLayer.addChild(hoverGraphics);
        },

        junctionsChanged: function() {
            this.update();
        },

        /**
         * Updates the model-view-transform and anything that
         *   relies on it.
         */
        updateMVT: function(mvt) {
            ComponentView.prototype.updateMVT.apply(this, arguments);

            this.update();
        },

        update: function() {
            // Direction vector from start to end junctions in model space
            var vec = this._vec
                .set(this.model.getEndPoint())
                .sub(this.model.getStartPoint());

            var modelLength = vec.length();
            var viewLength = this.mvt.modelToViewDeltaX(modelLength);
            var viewWidth = viewLength / LightBulbView.LENGTH_TO_WIDTH_RATIO;
            var imageWidth = this.onSprite.texture.width;
            var scale = viewWidth / imageWidth;

            var angle = -Math.atan2(vec.y, vec.x);
            angle += LightBulbView.getRotationOffset(this.model.get('connectAtLeft'));
            angle += Math.PI / 2;

            if (Math.abs(scale) > 1E-4) {
                this.displayObject.scale.x = scale;
                this.displayObject.scale.y = scale;
                
                this.hoverLayer.scale.x = scale;
                this.hoverLayer.scale.y = scale;
            }

            this.displayObject.rotation = angle;
            this.hoverLayer.rotation = angle;

            var viewStartPosition = this.mvt.modelToView(this.model.getStartPoint());
            this.displayObject.x = viewStartPosition.x;
            this.displayObject.y = viewStartPosition.y;

            this.hoverLayer.x = viewStartPosition.x;
            this.hoverLayer.y = viewStartPosition.y;
        },

        initContextMenu: function($contextMenu) {
            ComponentView.prototype.initContextMenu.apply(this, arguments);

            this.initShowValueMenuItem($contextMenu);
            this.initChangeResistanceMenuItem($contextMenu);
            this.initFlipMenuItem($contextMenu);
        },

        initFlipMenuItem: function($contextMenu) {
            $contextMenu.on('click', '.flip-btn', _.bind(this.flip, this));
        },

        flip: function() {
            this.model.flip();
            this.update();
            this.hidePopover();
        },

        generateTexture: function() {
            var texture = PIXI.Texture.EMPTY;
            return texture;
        }

    }, _.extend({

        getRotationOffset: function(connectAtLeft) {
            var x = LightBulbView.END_POINT_OFFSET_PERCENT_X;
            var y = LightBulbView.END_POINT_OFFSET_PERCENT_Y;
            var sign = connectAtLeft ? 1 : -1;
            return -Math.atan2(x, y) * sign;
        },

        getDefaultRotation: function() {
            var x = LightBulbView.END_POINT_OFFSET_PERCENT_X;
            var y = LightBulbView.END_POINT_OFFSET_PERCENT_Y;
            return Math.atan2(y, x);
        }

    }, Constants.LightBulbView));

    return LightBulbView;
});