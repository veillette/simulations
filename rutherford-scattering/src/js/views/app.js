import PixiAppView from 'common/v3/pixi/view/app';
import RutherfordAtomSimView from 'rutherford-scattering/views/sim/rutherford';
import PlumPuddingSimView from 'rutherford-scattering/views/sim/plum-pudding';
import Assets from 'assets';
import 'rutherford-scattering/styles/font-awesome.less';

var RutherfordScatteringAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        RutherfordAtomSimView,
        PlumPuddingSimView
    ]

});

export default RutherfordScatteringAppView;
