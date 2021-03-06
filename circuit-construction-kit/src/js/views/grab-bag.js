define(function(require) {

    'use strict';

    var _    = require('underscore');
    var PIXI = require('pixi');

    var AppView          = require('common/v3/app/app');
    var ComponentToolbox = require('views/component-toolbox');
    var GrabBagIcon      = require('views/toolbox-icons/grab-bag');

    var Constants = require('constants');

    /**
     * It's another toolbox for grab-bag items that pops out.
     */
    var GrabBag = ComponentToolbox.extend({

        initialize: function(options) {
            options = _.extend({
                topToBottom: false,
                anchorX: 0,
                anchorY: 0,
                anchorArrowWidth: 20,
                icons: []
            }, options);

            this.anchorX = options.anchorX;
            this.anchorY = options.anchorY;
            this.anchorArrowWidth = options.anchorArrowWidth;

            ComponentToolbox.prototype.initialize.apply(this, [options]);
        },

        initIcons: function() {
            var iconWidth = this.getIconWidth();
            var maxHeight = this.getIconMaxHeight();

            var items = this.simulation.grabBagItems;

            this.icons = [];
            for (var i = 0; i < items.length; i++) {
                var icon = new GrabBagIcon({
                    grabBagItem: items[i],
                    width: iconWidth,
                    maxHeight: maxHeight,
                    labelFontSize: AppView.windowIsShort() ? Constants.TOOLBOX_SHORT_SCREEN_LABEL_FONT_SIZE : Constants.TOOLBOX_LABEL_FONT_SIZE,
                    mvt: this.mvt,
                    simulation: this.simulation,
                    dummyLayer: this.dummyLayer
                });
                this.icons.push(icon);
                this.iconsContainer.addChild(icon.displayObject);
            }
        },

        updateLayout: function() {
            ComponentToolbox.prototype.updateLayout.apply(this, arguments);

            var anchorX = this.anchorX - this.displayObject.x;
            var anchorY = this.anchorY - this.displayObject.y;

            // Draw little anchor arrow
            var background = this.background;
            background.beginFill(this.fillColor, this.fillAlpha);
            background.moveTo(0, anchorY + this.anchorArrowWidth / 2);
            background.lineTo(anchorX, anchorY);
            background.lineTo(0, anchorY - this.anchorArrowWidth / 2);
            background.endFill();
        },

        setAnchor: function(x, y) {
            this.anchorX = x;
            this.anchorY = y;
            this.updateLayout();
        },

        show: function() {
            this.displayObject.visible = true;
        },

        hide: function() {
            this.displayObject.visible = false;
        }

    });


    return GrabBag;
});