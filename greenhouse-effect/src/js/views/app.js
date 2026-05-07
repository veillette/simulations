import PixiAppView from 'common/v3/pixi/view/app';
import GreenhouseEffectSimView from 'views/sim/greenhouse-effect';
import GlassLayersSimView from 'views/sim/glass-layers';
import PhotonAbsorptionSimView from 'views/sim/photon-absorption';
import Assets from 'assets';
import 'styles/font-awesome.less';

var GreenhouseEffectAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        GreenhouseEffectSimView,
        GlassLayersSimView,
        PhotonAbsorptionSimView
    ]

});

export default GreenhouseEffectAppView;
