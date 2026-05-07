import _ from 'underscore';
import PixiAppView from 'common/v3/pixi/view/app';
import IntroSimView from 'views/sim/intro';
import AdvancedSimView from 'views/sim/advanced';
import Assets from 'assets';
import 'styles/font-awesome.less';
import 'styles/app.less';
import universalControlsHtml from 'templates/universal-controls.html?raw';

var CollisionLabAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        IntroSimView,
        AdvancedSimView
    ],

    events: _.extend({}, PixiAppView.prototype.events, {
        'click .sound-btn-mute'   : 'mute',
        'click .sound-btn-unmute' : 'unmute'
    }),

    render: function() {
        PixiAppView.prototype.render.apply(this);

        this.$el.append(universalControlsHtml);

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

export default CollisionLabAppView;
