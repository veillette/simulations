define(function (require) {

    'use strict';

    var Assets = require('common/pixi/assets');

    Assets.Path = 'img/';

    Assets.Images = {   
        TANK:           'tank.png',
        TANK_LID:       'tank-lid.png',
        HOSE_CONNECTOR: 'hose-connector.png',
        PRESSURE_GAUGE: 'pressure-gauge.png',
        PUMP_BASE:      'pump-base.png',
        PUMP_HANDLE:    'pump-handle.png'
    };

    Assets.SpriteSheets = {};

    return Assets;
});
