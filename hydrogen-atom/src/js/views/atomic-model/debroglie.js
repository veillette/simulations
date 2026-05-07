import $ from 'jquery';
import DeBroglieViewModes from 'hydrogen-atom/models/debroglie-view-modes';
import AtomicModelView from 'hydrogen-atom/views/atomic-model';
import DeBroglieModelRadialSubView from 'hydrogen-atom/views/atomic-model/debroglie-sub/radial';
import DeBroglieModel3DSubView from 'hydrogen-atom/views/atomic-model/debroglie-sub/three-d';
import DeBroglieModelBrightnessSubView from 'hydrogen-atom/views/atomic-model/debroglie-sub/brightness';

/**
 * Represents the scene for the DeBroglieModel
 */
var DeBroglieModelView = AtomicModelView.extend({

    /**
     * Initializes the new DeBroglieModelView.
     */
    initialize: function(options) {
        AtomicModelView.prototype.initialize.apply(this, arguments);

        this.renderContent();
    },

    /**
     * Initializes everything for rendering graphics
     */
    initGraphics: function() {
        AtomicModelView.prototype.initGraphics.apply(this, arguments);

        var options = {
            mvt: this.mvt,
            particleMVT: this.particleMVT,
            simulation: this.simulation
        };

        this.subViews = [];
        this.subViews[DeBroglieViewModes.BRIGHTNESS]      = new DeBroglieModelBrightnessSubView(options);
        this.subViews[DeBroglieViewModes.RADIAL_DISTANCE] = new DeBroglieModelRadialSubView(options);
        this.subViews[DeBroglieViewModes.HEIGHT_3D]       = new DeBroglieModel3DSubView(options);

        this.displayObject.addChild(this.subViews[DeBroglieViewModes.BRIGHTNESS].displayObject);
        this.displayObject.addChild(this.subViews[DeBroglieViewModes.RADIAL_DISTANCE].displayObject);
        this.displayObject.addChild(this.subViews[DeBroglieViewModes.HEIGHT_3D].displayObject);
    },

    renderContent: function() {
        var self = this;

        this.$select = $(
            '<select class="debroglie-view-mode">' +
                '<option value="' + DeBroglieViewModes.RADIAL_DISTANCE + '">Radial View</option>' +
                '<option value="' + DeBroglieViewModes.HEIGHT_3D       + '">3D View</option>' +
                '<option value="' + DeBroglieViewModes.BRIGHTNESS      + '">Brightness View</option>' +
            '</select>'
        );
        this.$select.on('change', function(event) {
            var mode = parseInt($(this).val());
            self.getAtom().set('viewMode', mode);
        });

        var $wrapper = $('<div class="debroglie-view-mode-wrapper">');
        $wrapper.append(this.$select);

        this.$el.append($wrapper);
    },

    update: function(time, deltaTime, paused) {
        AtomicModelView.prototype.update.apply(this, arguments);

        this.subViews[this.atom.get('viewMode')].update(time, deltaTime, paused);
    },

    activate: function() {
        this.listenTo(this.getAtom(), 'change:viewMode', this.viewModeChanged);
        this.viewModeChanged(this.getAtom(), this.getAtom().get('viewMode'));

        this.$select
            .val(this.getAtom().get('viewMode'))
            ;

        AtomicModelView.prototype.activate.apply(this, arguments);
    },

    deactivate: function() {
        AtomicModelView.prototype.deactivate.apply(this, arguments);

        this.stopListening(this.atom);
    },

    viewModeChanged: function(atom, viewMode) {
        for (var key in this.subViews) {
            if (Object.prototype.hasOwnProperty.call(this.subViews, key))
                this.subViews[key].deactivate();
        }

        this.subViews[viewMode].activate();
    }

});


export default DeBroglieModelView;