import PixiAppView from 'common/v3/pixi/view/app';
import ProjectileMotionSimView from 'views/sim';
import Assets from 'assets';
import 'styles/font-awesome.less';

var ProjectileMotionAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        ProjectileMotionSimView
    ]

});

export default ProjectileMotionAppView;
