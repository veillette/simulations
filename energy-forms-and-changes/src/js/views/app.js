import PixiAppView from 'common/v3/pixi/view/app';
import IntroSimView from 'views/sim/intro';
import EnergySystemsSimView from 'views/sim/energy-systems';
import 'styles/font-awesome.less';
import Assets from 'assets';

var EFCAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        IntroSimView,
        EnergySystemsSimView
    ]

});

export default EFCAppView;
