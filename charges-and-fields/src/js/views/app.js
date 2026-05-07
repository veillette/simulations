import PixiAppView from 'common/v3/pixi/view/app';
import ChargesAndFieldsSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var ChargesAndFieldsAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        ChargesAndFieldsSimView
    ]

});

export default ChargesAndFieldsAppView;
