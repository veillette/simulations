define(function(require) {
    
    'use strict';

    var _ = require('underscore');
    var $ = require('jquery');

    var PixiAppView = require('common/v3/pixi/view/app');

    var BarMagnetSimView     = require('views/sim/bar-magnet');
    var PickupCoilSimView    = require('views/sim/pickup-coil');
    var ElectromagnetSimView = require('views/sim/electromagnet');
    var TransformerSimView   = require('views/sim/transformer');
    var GeneratorSimView     = require('views/sim/generator');

    var Assets = require('assets');

    var Constants = require('constants');

    require('less!common/styles/slider');
    require('less!styles/font-awesome');
    require('less!styles/app');

    var settingsDialogHtml = require('text!templates/settings-dialog.html');

    var FaradayAppView = PixiAppView.extend({

        assets: Assets.getAssetList(),

        simViewConstructors: [
            BarMagnetSimView,
            PickupCoilSimView,
            ElectromagnetSimView,
            TransformerSimView,
            GeneratorSimView
        ],

        events: _.extend({}, PixiAppView.prototype.events, {
            'slide #needle-spacing-slider' : 'changeNeedleSpacing',
            'slide #needle-size-slider'    : 'changeNeedleSize'
        }),

        render: function() {
            PixiAppView.prototype.render.apply(this);

            this.$el.append(settingsDialogHtml);

            this.$('#needle-spacing-slider').noUiSlider({
                start: Constants.GRID_SPACING,
                range: {
                    min: Constants.GRID_SPACING_MIN,
                    max: Constants.GRID_SPACING_MAX
                },
                step: 1
            });

            this.$('#needle-size-slider').noUiSlider({
                start: Constants.GRID_NEEDLE_WIDTH,
                range: {
                    min: Constants.GRID_NEEDLE_WIDTH_MIN,
                    max: Constants.GRID_NEEDLE_WIDTH_MAX
                },
                step: 1
            });

            this.$spacing = this.$('#needle-spacing-value');
            this.$size    = this.$('#needle-size-value');
        },

        changeNeedleSpacing: function(event) {
            var spacing = parseInt($(event.target).val());
            this.$spacing.html(spacing);

            for (var i = 0; i < this.simViews.length; i++)
                this.simViews[i].setNeedleSpacing(spacing);
        },

        changeNeedleSize: function(event) {
            var width  = parseInt($(event.target).val());
            var height = parseInt(width / Constants.GRID_NEEDLE_ASPECT_RATIO);

            this.$size.html(width + 'x' + height);

            for (var i = 0; i < this.simViews.length; i++)
                this.simViews[i].setNeedleSize(width, height);
        }

    });

    return FaradayAppView;
});