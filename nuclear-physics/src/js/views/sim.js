import _ from 'underscore';
import SimView from 'common/v3/app/sim';
import NuclearPhysicsSimulation from 'models/simulation';
import NuclearPhysicsSceneView from 'views/scene';
import Constants from 'constants';
import 'bootstrap';
import 'styles/sim.less';
import 'common/styles/slider.less';
import 'common/styles/radio.less';
import simHtml from 'templates/sim.html?raw';

/**
 * This is the umbrella view for everything in a simulation tab.
 *   It will be extended by both the Intro module and the Charts
 *   and contains all the common functionality between the two.
 */
var NuclearPhysicsSimView = SimView.extend({

    /**
     * Root element properties
     */
    tagName:   'section',
    className: 'sim-view',

    /**
     * Template for rendering the basic scaffolding
     */
    template: _.template(simHtml),

    /**
     * Dom event listeners
     */
    events: {

    },

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Nuclear Physics',
            name: 'nuclear-physics',
        }, options);

        SimView.prototype.initialize.apply(this, [options]);

        this.initSceneView();
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new NuclearPhysicsSimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new NuclearPhysicsSceneView({
            simulation: this.simulation
        });
    },

    /**
     * Renders everything
     */
    render: function() {
        this.$el.empty();

        this.renderScaffolding();
        this.renderSceneView();

        return this;
    },

    /**
     * Renders page content. Should be overriden by child classes
     */
    renderScaffolding: function() {
        var data = {
            Constants: Constants,
            simulation: this.simulation
        };
        this.$el.html(this.template(data));
        this.$('select');
    },

    /**
     * Renders the scene view
     */
    renderSceneView: function() {
        this.sceneView.render();
        this.$('.scene-view-placeholder').replaceWith(this.sceneView.el);
    },

    /**
     * Called after every component on the page has rendered to make sure
     *   things like widths and heights and offsets are correct.
     */
    postRender: function() {
        this.sceneView.postRender();
    },

    /**
     * This is run every tick of the updater.  It updates the wave
     *   simulation and the views.
     */
    update: function(time, deltaTime) {
        // Update the model
        this.simulation.update(time, deltaTime);

        var timeSeconds = time / 1000;
        var dtSeconds   = deltaTime / 1000;

        // Update the scene
        this.sceneView.update(timeSeconds, dtSeconds, this.simulation.get('paused'));
    },

});

export default NuclearPhysicsSimView;
