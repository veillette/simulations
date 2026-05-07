import _ from 'underscore';
import PixiAppView from 'common/v3/pixi/view/app';
import SingleSourceSimView from 'views/sim/single-source';
import MeasureSimView from 'views/sim/measure';
import TwoSourceInterferenceSimView from 'views/sim/two-source-interference';
import ReflectionInterferenceSimView from 'views/sim/reflection-interference';
import VariableAirPressureSimView from 'views/sim/variable-air-pressure';
import Assets from 'assets';
import 'styles/font-awesome.less';
import 'styles/app.less';

var SoundAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        SingleSourceSimView,
        MeasureSimView,
        TwoSourceInterferenceSimView,
        ReflectionInterferenceSimView,
        VariableAirPressureSimView
    ],

    events: _.extend({}, PixiAppView.prototype.events, {
        'click .sound-btn-mute'   : 'mute',
        'click .sound-btn-unmute' : 'unmute'
    }),

    render: function() {
        PixiAppView.prototype.render.apply(this);

        this.$mute   = this.$('.sound-btn-mute');
        this.$unmute = this.$('.sound-btn-unmute');
    },

    mute: function(event) {
        _.each(this.simViews, function(simView) {
            simView.mute();
        });
        this.$mute.hide();
        this.$unmute.show();
    },

    unmute: function(event) {
        _.each(this.simViews, function(simView) {
            simView.unmute();
        });
        this.$unmute.hide();
        this.$mute.show();
    }

});

export default SoundAppView;
