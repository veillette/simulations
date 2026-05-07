import PixiAppView from 'common/v3/pixi/view/app';
import IntroSimView from 'views/sim/intro';
import DielectricSimView from 'views/sim/dielectric';
import MultipleCapacitorsSimView from 'views/sim/multiple-capacitors';
import Assets from 'assets';
import 'styles/font-awesome.less';

var CapacitorLabAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        IntroSimView,
        DielectricSimView,
        MultipleCapacitorsSimView
    ]

});

export default CapacitorLabAppView;
