import PixiAppView from 'common/v3/pixi/view/app';
import TemplateSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var TemplateAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        TemplateSimView
    ]

});

export default TemplateAppView;
