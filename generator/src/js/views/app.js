import FaradayAppView from 'views/app';
import GeneratorBarMagnetSimView from './sim/bar-magnet';
import GeneratorPickupCoilSimView from './sim/pickup-coil';
import GeneratorElectromagnetSimView from './sim/electromagnet';
import GeneratorTransformerSimView from './sim/transformer';
import GeneratorGeneratorSimView from './sim/generator';
import Assets from 'assets';

var GeneratorAppView = FaradayAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        GeneratorBarMagnetSimView,
        GeneratorPickupCoilSimView,
        GeneratorElectromagnetSimView,
        GeneratorTransformerSimView,
        GeneratorGeneratorSimView
    ],

    defaultSimViewIndex: 4

});

export default GeneratorAppView;
