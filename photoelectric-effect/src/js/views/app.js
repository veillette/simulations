import _ from 'underscore';
import PixiAppView from 'common/v3/pixi/view/app';
import PEffectSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';
import 'styles/app.less';
import settingsDialogHtml from 'templates/settings-dialog.html?raw';

var PEffectAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        PEffectSimView
    ],

    events: _.extend({}, PixiAppView.prototype.events, {
        'click #show-photons-check' : 'togglePhotons',
        'click #control-photon-count-check' : 'togglePhotonControl'
    }),

    render: function() {
        PixiAppView.prototype.render.apply(this);

        this.$el.append(settingsDialogHtml);
    },

    togglePhotons: function() {
        if ($(event.target).is(':checked'))
            this.simViews[0].showPhotons();
        else
            this.simViews[0].hidePhotons();
    },

    togglePhotonControl: function() {
        if ($(event.target).is(':checked'))
            this.simViews[0].setPhotonCountControlMode();
        else
            this.simViews[0].setIntensityControlMode();
    }

});

export default PEffectAppView;
