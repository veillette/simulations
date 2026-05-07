import PixiAppView from 'common/v3/pixi/view/app';
import FriendlyScaleSimView from 'views/sim/friendly-scale';
import ToScaleSimView from 'views/sim/to-scale';
import Assets from 'assets';
import 'styles/font-awesome.less';

var GOAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        FriendlyScaleSimView,
        ToScaleSimView
    ]

});

export default GOAppView;
