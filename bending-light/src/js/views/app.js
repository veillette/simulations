import PixiAppView from 'common/v3/pixi/view/app';
import IntroSimView from 'views/sim/intro';
import PrismBreakSimView from 'views/sim/prism-break';
import MoreToolsSimView from 'views/sim/more-tools';
import Assets from 'assets';
import 'styles/font-awesome.less';

var BendingLightAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        IntroSimView,
        PrismBreakSimView,
        MoreToolsSimView
    ]

});

export default BendingLightAppView;
