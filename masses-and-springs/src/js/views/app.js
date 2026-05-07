import PixiAppView from 'common/v3/pixi/view/app';
import MassesAndSpringsSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var MassesAndSpringsAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        MassesAndSpringsSimView
    ]

});

export default MassesAndSpringsAppView;
