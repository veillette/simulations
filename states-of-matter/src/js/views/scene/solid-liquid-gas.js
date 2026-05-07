import AppView from 'common/v3/app/app';
import SOMSceneView from 'views/scene';
import Constants from 'constants';


var SolidLiquidGasSceneView = SOMSceneView.extend({

    heaterCoolerPosition: AppView.windowIsShort() ?
        Constants.SolidLiquidGasSceneView.SHORT_SCREEN_HEATER_COOLER_POSITION :
        Constants.SolidLiquidGasSceneView.HEATER_COOLER_POSITION,

    particleTankPosition: AppView.windowIsShort() ?
        Constants.SolidLiquidGasSceneView.SHORT_SCREEN_TANK_POSITION :
        Constants.SolidLiquidGasSceneView.TANK_POSITION,

    initialize: function(options) {
        SOMSceneView.prototype.initialize.apply(this, [options]);
    },

}, Constants.SolidLiquidGasSceneView);

export default SolidLiquidGasSceneView;
