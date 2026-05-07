import PixiAppView from 'common/v3/pixi/view/app';
import WaterSimView from './sim/water';
import SoundSimView from './sim/sound';
import LightSimView from './sim/light';
import 'styles/font-awesome.less';

var WaveInterferenceAppView = PixiAppView.extend({

    assets: [],

    simViewConstructors: [
        WaterSimView,
        SoundSimView,
        LightSimView
    ]

});

export default WaveInterferenceAppView;
