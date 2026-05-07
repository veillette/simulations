import PixiAppView from 'common/v3/pixi/view/app';
import MazeGameSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var MazeGameAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        MazeGameSimView
    ]

});

export default MazeGameAppView;
