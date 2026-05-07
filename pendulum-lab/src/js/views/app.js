import PixiAppView from 'common/v3/pixi/view/app';
import PendulumLabSimView from 'views/sim';
import 'styles/font-awesome.less';

var PendulumLabAppView = PixiAppView.extend({

    assets: [],

    simViewConstructors: [
        PendulumLabSimView
    ]

});

export default PendulumLabAppView;
