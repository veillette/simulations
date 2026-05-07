import FaradayAppView from 'views/app';
import MEBarMagnetSimView from './sim/bar-magnet';
import MEElectromagnetSimView from './sim/electromagnet';
import Assets from 'assets';

var MEAppView = FaradayAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        MEBarMagnetSimView,
        MEElectromagnetSimView
    ]

});

export default MEAppView;
