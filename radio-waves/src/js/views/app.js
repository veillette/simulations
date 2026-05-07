import PixiAppView from 'common/v3/pixi/view/app';
import RadioWavesSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var RadioWavesAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        RadioWavesSimView
    ]

});

export default RadioWavesAppView;
