import _ from 'underscore';
import GlassLayersSimulation from 'models/simulation/glass-layers';
import GlassLayersSceneView from 'views/scene/glass-layers';
import BaseGreenhouseSimView from 'views/sim/base-greenhouse';
import simHtml from 'templates/sim-glass-layers.html?raw';

/**
 * SimView for the Glass Layers tab
 */
var GlassLayersSimView = BaseGreenhouseSimView.extend({

    /**
     * Template for rendering the basic scaffolding
     */
    template: _.template(simHtml),

    /**
     * Dom event listeners
     */
    events: _.extend({}, BaseGreenhouseSimView.prototype.events, {
        'click .add-glass-pane-btn'     : 'addGlassPane',
        'click .remove-glass-pane-btn'  : 'removeGlassPane'
    }),

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Glass Layers',
            name: 'glass-layers',
        }, options);

        BaseGreenhouseSimView.prototype.initialize.apply(this, [options]);
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new GlassLayersSimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new GlassLayersSceneView({
            simulation: this.simulation
        });
    },

    /**
     * Adds a glass pane to the sim.
     */
    addGlassPane: function() {
        this.simulation.addGlassPane();
    },

    /**
     * Removes a glass pane from the sim.
     */
    removeGlassPane: function() {
        this.simulation.removeGlassPane();
    }

});

export default GlassLayersSimView;
