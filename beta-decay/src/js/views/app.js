import NuclearPhysicsAppView from 'views/app';
import MultiNucleusBetaDecaySimView from 'beta-decay/views/sim/multiple';
import SingleNucleusBetaDecaySimView from 'beta-decay/views/sim/single';
import Assets from 'assets';

var BetaDecayAppView = NuclearPhysicsAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        MultiNucleusBetaDecaySimView,
        SingleNucleusBetaDecaySimView
    ]

});

export default BetaDecayAppView;
