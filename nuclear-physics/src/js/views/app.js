import PixiAppView from 'common/v3/pixi/view/app';
import NuclearPhysicsSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var NuclearPhysicsAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        NuclearPhysicsSimView
    ]

});

export default NuclearPhysicsAppView;
