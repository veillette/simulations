import _ from 'underscore';
import PixiAppView from 'common/v3/pixi/view/app';
import SolidLiquidGasSimView from 'views/sim/solid-liquid-gas';
import PhaseChangesSimView from 'views/sim/phase-changes';
import Assets from 'assets';
import 'styles/font-awesome.less';
import 'styles/app.less';
import settingsDialogHtml from 'templates/settings-dialog.html?raw';


var SOMAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        SolidLiquidGasSimView,
        PhaseChangesSimView
    ],

    events: _.extend({}, PixiAppView.prototype.events, {
        'click #temperature-kelvin'  : 'kelvinSelected',
        'click #temperature-celsius' : 'celsiusSelected'
    }),

    render: function() {
        PixiAppView.prototype.render.apply(this);

        this.$el.append(settingsDialogHtml);
    },

    kelvinSelected: function(event) {
        _.each(this.simViews, function(simView) {
            simView.useKelvin();
        });
    },

    celsiusSelected: function(event) {
        _.each(this.simViews, function(simView) {
            simView.useCelsius();
        });
    }

});

export default SOMAppView;
