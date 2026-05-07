import FaradayAppView from 'views/app';
import MagnetAndCompassSimView from './sim/magnet-and-compass';
import Assets from 'assets';

var MagnetAndCompassAppView = FaradayAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        MagnetAndCompassSimView
    ]

});

export default MagnetAndCompassAppView;
