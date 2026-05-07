import AppView from 'common/v3/app/app';
import ModelViewTransform from 'common/math/model-view-transform';
import Vector2 from 'common/math/vector2';
import LasersSceneView from 'views/scene';
import LampArrayView from 'views/lamp-array';
import AtomView from 'views/atom';
import Constants from 'constants';

/**
 *
 */
var MultipleAtomsSceneView = LasersSceneView.extend({

    initialize: function(options) {
        LasersSceneView.prototype.initialize.apply(this, arguments);

        this.listenTo(this.simulation, 'change:elementProperties',     this.elementPropertiesChanged);
        this.listenTo(this.simulation, 'change:pumpingPhotonViewMode', this.determineBeamCurtainViewVisibility);
        this.listenTo(this.simulation, 'change:lasingPhotonViewMode',  this.determineLaserWaveViewVisibility);
    },

    renderContent: function() {

    },

    initGraphics: function() {
        LasersSceneView.prototype.initGraphics.apply(this, arguments);

        this.initAtoms();
        this.initLamps();


        this.determineLaserWaveViewVisibility();

        this.elementPropertiesChanged(this.simulation, this.simulation.get('elementProperties'));
    },

    initMVT: function() {
        var scale;

        if (AppView.windowIsShort()) {
            this.viewOriginX = 294;
            this.viewOriginY = 90;
            scale = 0.76;
        }
        else {
            this.viewOriginX = 150;
            this.viewOriginY = 80;
            scale = 0.98;
        }

        this.mvt = ModelViewTransform.createSinglePointScaleMapping(
            new Vector2(0, 0),
            new Vector2(this.viewOriginX, this.viewOriginY),
            scale
        );
    },

    initAtoms: function() {
        this.atomViews = [];

        for (var i = 0; i < this.simulation.atoms.length; i++) {
            var atomView = new AtomView({
                model: this.simulation.atoms.at(i),
                mvt: this.mvt
            });

            this.atomViews.push(atomView);
            this.atomLayer.addChild(atomView.displayObject);
        }
    },

    initLamps: function() {
        this.lampArrayView = new LampArrayView({
            model: this.simulation.pumpingBeam,
            mvt: this.mvt
        })

        this.lampLayer.addChild(this.lampArrayView.displayObject);
    },

    _update: function(time, deltaTime, paused, timeScale) {
        LasersSceneView.prototype._update.apply(this, arguments);
    },

    elementPropertiesChanged: function(simulation, elementProperties) {
        this.determineBeamCurtainViewVisibility();
        this.determineLaserWaveViewVisibility();
    },

    determineBeamCurtainViewVisibility: function() {
        if (this.simulation.get('pumpingPhotonViewMode') === Constants.PHOTON_CURTAIN) {
            this.beamCurtainView.show();
        }
        else {
            this.beamCurtainView.hide();
        }
    },

    determineLaserWaveViewVisibility: function() {
        if (this.simulation.get('lasingPhotonViewMode') === Constants.PHOTON_WAVE) {
            this.laserWaveView.show();
        }
        else {
            this.laserWaveView.hide();
        }
    }

});

export default MultipleAtomsSceneView;
