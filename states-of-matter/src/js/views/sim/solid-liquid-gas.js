import _ from 'underscore';
import PhaseStateChanger from 'models/phase-state-changer';
import SOMSimView from 'views/sim';
import SolidLiquidGasSceneView from 'views/scene/solid-liquid-gas';
import phaseChangeButtons from 'templates/phase-change-buttons.html?raw';


var SolidLiquidGasSimView = SOMSimView.extend({

    events: _.extend(SOMSimView.prototype.events, {
        // Playback controls
        'click #phase-solid'  : 'makeSolid',
        'click #phase-liquid' : 'makeLiquid',
        'click #phase-gas'    : 'makeGas'
    }),

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Solid, Liquid, Gas',
            name: 'solid-liquid-gas-sim',
            link: 'states-of-matter-basics'
        }, options);

        SOMSimView.prototype.initialize.apply(this, [options]);

        this.initSceneView();
    },

    /**
     * Renders page content. Should be overriden by child classes
     */
    renderScaffolding: function() {
        SOMSimView.prototype.renderScaffolding.apply(this);

        this.$('.side-panel').append(phaseChangeButtons);
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new SolidLiquidGasSceneView({
            simulation: this.simulation
        });
    },

    makeSolid: function() {
        this.simulation.setPhase(PhaseStateChanger.SOLID);
    },

    makeLiquid: function() {
        this.simulation.setPhase(PhaseStateChanger.LIQUID);
    },

    makeGas: function() {
        this.simulation.setPhase(PhaseStateChanger.GAS);
    }

});

export default SolidLiquidGasSimView;
