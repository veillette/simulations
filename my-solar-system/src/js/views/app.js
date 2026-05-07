import PixiAppView from 'common/v3/pixi/view/app';
import MSSSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var MSSAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        MSSSimView
    ]

});

export default MSSAppView;
