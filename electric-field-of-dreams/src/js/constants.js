define(function (require) {

    'use strict';

    var range = require('common/math/range');

    var Constants = {}; 

    /*************************************************************************
     **                                                                     **
     **                         UNIVERSAL CONSTANTS                         **
     **                                                                     **
     *************************************************************************/

    Constants.SYSTEM_WIDTH = 300; // Arbitrary units
    Constants.SYSTEM_HEIGHT = Constants.SYSTEM_WIDTH;
    Constants.SYSTEM_MIN_X = 50;
    Constants.SYSTEM_MIN_Y = 50;

    Constants.FRAME_DURATION = 35 / 1000; // Seconds
    Constants.DT_PER_FRAME = 0.15;        // Seconds

    Constants.DISCRETENESS_RANGE = range({ min: 1, max: 30, defaultValue: 10 });
    Constants.MAX_ARROW_LENGTH = 25;


    /*************************************************************************
     **                                                                     **
     **                     EXTERNAL FIELD CONTROL VIEW                     **
     **                                                                     **
     *************************************************************************/

    var ExternalFieldControlView = {};

    ExternalFieldControlView.RIGHT = 20;
    ExternalFieldControlView.BOTTOM = 62 + 20;
    ExternalFieldControlView.PANEL_PADDING = 15;
    ExternalFieldControlView.PANEL_WIDTH  = 200; // pixels
    ExternalFieldControlView.PANEL_HEIGHT = 240; // pixels
    ExternalFieldControlView.PANEL_COLOR = '#fff';
    ExternalFieldControlView.PANEL_ALPHA = 0.5;
    ExternalFieldControlView.AREA_WIDTH  = ExternalFieldControlView.PANEL_WIDTH - 2 * ExternalFieldControlView.PANEL_PADDING;
    ExternalFieldControlView.AREA_HEIGHT = ExternalFieldControlView.PANEL_WIDTH - 2 * ExternalFieldControlView.PANEL_PADDING;
    ExternalFieldControlView.ARROW_AREA_COLOR = '#fff';
    ExternalFieldControlView.ARROW_AREA_ALPHA = 0.5;
    ExternalFieldControlView.ARROW_COLOR = '#21366b';

    Constants.ExternalFieldControlView = ExternalFieldControlView;


    /*************************************************************************
     **                                                                     **
     **                            PARTICLE VIEW                            **
     **                                                                     **
     *************************************************************************/

    var ParticleView = {};

    ParticleView.MODEL_RADIUS = 12;
    ParticleView.FILL_COLOR = '#7986A6';
    ParticleView.LINE_COLOR = '#21366b';
    ParticleView.LINE_WIDTH = 3;

    Constants.ParticleView = ParticleView;

    


    return Constants;
});
