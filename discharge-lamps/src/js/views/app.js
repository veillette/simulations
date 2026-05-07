import PixiAppView from 'common/v3/pixi/view/app';
import DischargeLampsSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var DischargeLampsAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        DischargeLampsSimView
    ]

});

export default DischargeLampsAppView;
