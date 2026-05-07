import _ from 'underscore';
import PixiAppView from 'common/v3/pixi/view/app';
import EFDSimView from 'views/sim';
import Assets from 'assets';
import Constants from 'constants';
import 'common/styles/slider.less';
import 'styles/font-awesome.less';
import 'styles/app.less';
import settingsDialogHtml from 'templates/settings-dialog.html?raw';


var EFDAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        EFDSimView
    ],

    events: _.extend({}, PixiAppView.prototype.events, {
        'slide #efield-discreteness-slider' : 'changeEFieldDiscreteness'
    }),

    render: function() {
        PixiAppView.prototype.render.apply(this);

        this.$el.append(settingsDialogHtml);

        var ticks = '<div class="ticks">';
        var length = Constants.DISCRETENESS_RANGE.length();
        var labeledValues = [1, 15, 30];
        for (var i = 0; i <= length; i++) {
            ticks += '<div class="tick" style="left: ' + ((i / length) * 100) + '%">';
            if (_.contains(labeledValues, i + 1))
                ticks += '<div class="label">' + (i + 1) + '</div>';
            ticks += '</div>';
        }
        ticks += '</div>';

        this.$('#efield-discreteness-slider').noUiSlider({
            start: Constants.DISCRETENESS_RANGE.defaultValue,
            range: {
                min: Constants.DISCRETENESS_RANGE.min,
                max: Constants.DISCRETENESS_RANGE.max
            },
            step: 1
        }).append(ticks);

        // .noUiSlider_pips({
        //     mode: 'values',
        //     // values: (function(){
        //     //     var positions = [];
        //     //     for (var i = Constants.DISCRETENESS_RANGE.min; i <= Constants.DISCRETENESS_RANGE.max; i++)
        //     //         positions.push(i);
        //     //     return positions;
        //     // })(),
        //     values: [1, 15, 30],
        //     density: 3,
        //     stepped: true
        // });
    },

    changeEFieldDiscreteness: function(event) {
        var discreteness = parseInt($(event.target).val());
        this.simViews[0].setEFieldDiscreteness(discreteness);
    }

});

export default EFDAppView;