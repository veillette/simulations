import NuclearPhysicsAppView from 'views/app';
import OneNucleusSimView from 'nuclear-fission/views/sim/one-nucleus';
import ChainReactionSimView from 'nuclear-fission/views/sim/chain-reaction';
import NuclearReactorSimView from 'nuclear-fission/views/sim/nuclear-reactor';
import Assets from 'assets';
import 'nuclear-fission/styles/font-awesome.less';

var NuclearFissionAppView = NuclearPhysicsAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        OneNucleusSimView,
        ChainReactionSimView,
        NuclearReactorSimView
    ]

});

export default NuclearFissionAppView;
