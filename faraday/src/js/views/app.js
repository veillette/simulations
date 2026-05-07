import _ from 'underscore';
import $ from 'jquery';
import PixiAppView from 'common/v3/pixi/view/app';
import BarMagnetSimView from 'views/sim/bar-magnet';
import PickupCoilSimView from 'views/sim/pickup-coil';
import ElectromagnetSimView from 'views/sim/electromagnet';
import TransformerSimView from 'views/sim/transformer';
import GeneratorSimView from 'views/sim/generator';
import Assets from 'assets';
import Constants from 'constants';
import 'common/styles/slider.less';
import 'styles/font-awesome.less';
import 'styles/app.less';
import settingsDialogHtml from 'templates/settings-dialog.html?raw';
import settingsButtonHtml from 'templates/settings-button.html?raw';

var FaradayAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        BarMagnetSimView,
        PickupCoilSimView,
        ElectromagnetSimView,
        TransformerSimView,
        GeneratorSimView
    ],

    render: function() {
        PixiAppView.prototype.render.apply(this);

        this.$el.append(settingsButtonHtml);

        var $dialog = $(settingsDialogHtml);

        $dialog.find('#needle-spacing-slider').on('slide', _.bind(this.changeNeedleSpacing, this));
        $dialog.find('#needle-size-slider'   ).on('slide', _.bind(this.changeNeedleSize,    this));

        $dialog.find('#needle-spacing-slider').noUiSlider({
            start: Constants.GRID_SPACING,
            range: {
                min: Constants.GRID_SPACING_MIN,
                max: Constants.GRID_SPACING_MAX
            },
            step: 1
        });

        $dialog.find('#needle-size-slider').noUiSlider({
            start: Constants.GRID_NEEDLE_WIDTH,
            range: {
                min: Constants.GRID_NEEDLE_WIDTH_MIN,
                max: Constants.GRID_NEEDLE_WIDTH_MAX
            },
            step: 1
        });

        this.$spacing = $dialog.find('#needle-spacing-value');
        this.$size    = $dialog.find('#needle-size-value');

        $('body').append($dialog);
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

export default FaradayAppView;
