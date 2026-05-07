import _ from 'underscore';
import NuclearPhysicsSimView from 'views/sim';
import NuclearFissionSimulation from 'nuclear-fission/models/simulation';
import NuclearFissionSceneView from 'nuclear-fission/views/scene';
import 'nuclear-fission/styles/sim.less';
import 'nuclear-fission/styles/playback-controls.less';

/**
 *
 */
var NuclearFissionSimView = NuclearPhysicsSimView.extend({

    /**
     * Dom event listeners
     */
    events: {
        'click .play-btn'  : 'play',
        'click .pause-btn' : 'pause',
        'click .step-btn'  : 'step',
        'click .reset-btn' : 'reset'
    },

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Nuclear Fission',
            name: 'nuclear-fission',
            link: 'nuclear-fission'
        }, options);

        NuclearPhysicsSimView.prototype.initialize.apply(this, [options]);

        this.listenTo(this.simulation, 'change:paused', this.pausedChanged);
        this.pausedChanged(this.simulation, this.simulation.get('paused'));
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new NuclearFissionSimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new NuclearFissionSceneView({
            simulation: this.simulation
        });
    },

    /**
     * Renders the scene view
     */
    renderSceneView: function() {
        NuclearPhysicsSimView.prototype.renderSceneView.apply(this, arguments);

        this.$el.append(this.sceneView.ui);
    },

    /**
     * The simulation changed its paused state.
     */
    pausedChanged: function() {
        if (this.simulation.get('paused'))
            this.$el.removeClass('playing');
        else
            this.$el.addClass('playing');
    }

});

export default NuclearFissionSimView;
