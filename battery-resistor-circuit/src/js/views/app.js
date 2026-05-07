import PixiAppView from 'common/v3/pixi/view/app';
import BRCSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var BRCAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        BRCSimView
    ]

});

export default BRCAppView;
