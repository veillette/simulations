import _ from 'underscore';
import VariableAirPressureSimulation from 'models/simulation/variable-air-pressure';
import SoundSimView from 'views/sim';
import VariableAirPressureSceneView from 'views/scene/variable-air-pressure';
import airDensityControlsHtml from 'templates/air-density-controls.html?raw';

/**
 *
 */
var VariableAirPressureSimView = SoundSimView.extend({

    showHelpBtn: false,

    /**
     * Dom event listeners
     */
    events: _.extend({}, SoundSimView.prototype.events, {
        'click .btn-add-air'    : 'addAirToBox',
        'click .btn-remove-air' : 'removeAirFromBox',
        'click .btn-reset-box'  : 'resetBox'
    }),

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Varying Air Pressure',
            name: 'variable-air-pressure',
        }, options);

        SoundSimView.prototype.initialize.apply(this, [options]);

        this.listenTo(this.simulation, 'change:airDensityPercent', this.airDensityChanged);
    },

    reset: function() {
        SoundSimView.prototype.reset.apply(this, arguments);

        this.$('.audio-listener').click();
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new VariableAirPressureSimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new VariableAirPressureSceneView({
            simulation: this.simulation
        });
    },

    /**
     * Renders page content
     */
    renderScaffolding: function() {
        SoundSimView.prototype.renderScaffolding.apply(this, arguments);

        this.renderAudioControls();
        this.$('.audio-listener').click();

        // Air density controls
        this.$('.sim-controls-column').append(airDensityControlsHtml);

        this.$addAirBtn    = this.$('.btn-add-air');
        this.$removeAirBtn = this.$('.btn-remove-air');
        this.$resetBoxBtn  = this.$('.btn-reset-box');
    },

    addAirToBox: function() {
        this.sceneView.addAirToBox();
        this.$addAirBtn.prop('disabled', true);
    },

    removeAirFromBox: function() {
        this.sceneView.removeAirFromBox();
        this.$removeAirBtn.prop('disabled', true);
    },

    resetBox: function() {
        this.sceneView.resetBox();
        this.$addAirBtn.hide();
        this.$removeAirBtn.show();
        this.$removeAirBtn.removeAttr('disabled');
    },

    airDensityChanged: function(simulation, airDensityPercent) {
        if (airDensityPercent === 1) {
            this.$addAirBtn.hide();
            this.$removeAirBtn.show();
            this.$removeAirBtn.removeAttr('disabled');
        }
        else if (airDensityPercent === 0) {
            this.$removeAirBtn.hide();
            this.$addAirBtn.show();
            this.$addAirBtn.removeAttr('disabled');
        }
    }

});

export default VariableAirPressureSimView;
