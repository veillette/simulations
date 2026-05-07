import Assets from 'assets';
import PixiAppView from 'common/v3/pixi/view/app';
import VectorAdditionSimView from 'views/sim';
import 'styles/font-awesome.less';

var VectorAdditionAppView = PixiAppView.extend({

   assets: Assets.getAssetList(),

    simViewConstructors: [
      VectorAdditionSimView
    ]

});

export default VectorAdditionAppView;
