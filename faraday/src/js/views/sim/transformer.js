import _ from 'underscore';
import TransformerSimulation from 'models/simulation/transformer';
import TransformerSceneView from 'views/scene/transformer';
import FaradaySimView from 'views/sim';


/**
 *
 */
var TransformerSimView = FaradaySimView.extend({

    /**
     * Dom event listeners
     */
    events: _.extend(FaradaySimView.prototype.events, {

    }),

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Transformer',
            name: 'transformer',
            hideCompass: true
        }, options);

        FaradaySimView.prototype.initialize.apply(this, [options]);
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new TransformerSimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new TransformerSceneView({
            simulation: this.simulation
        });
    },

    /**
     * Renders everything
     */
    render: function() {
        FaradaySimView.prototype.render.apply(this);

        this.renderPlaybackControls();
        this.renderElectromagnetControls();
        this.renderPickupCoilControls();

        return this;
    },

    /**
     * Resets all the components of the view.
     */
    resetComponents: function() {
        FaradaySimView.prototype.resetComponents.apply(this);

        this.resetElectromagnetControls();
        this.resetPickupCoilControls();
    }

});

export default TransformerSimView;
