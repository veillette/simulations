import CCKAppView from 'views/app';
import DCOnlySimView from './sim';
import Assets from 'assets';

var DCOnlyAppView = CCKAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        DCOnlySimView
    ]

});

export default DCOnlyAppView;
