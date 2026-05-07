import PixiAppView from 'common/v3/pixi/view/app';
import LadybugMotionSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var LadybugMotionAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        LadybugMotionSimView
    ]

});

export default LadybugMotionAppView;
