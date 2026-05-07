import _ from 'underscore';
import Assets from 'common/v3/pixi/assets';
import TimeFormatter from 'models/time-formatter';
import MeasurementSimulation from 'radioactive-dating-game/models/simulation/measurement';
import RadioactiveDatingGameSimView from 'radioactive-dating-game/views/sim';
import MeasurementSceneView from 'radioactive-dating-game/views/scene/measurement';
import Constants from 'constants';
import simHtml from 'radioactive-dating-game/templates/measurement-sim.html?raw';
import playbackControlsHtml from 'radioactive-dating-game/templates/measurement-playback-controls.html?raw';

/**
 * Multiple Atoms tab
 */
var MeasurementSimView = RadioactiveDatingGameSimView.extend({

    events: _.extend({}, RadioactiveDatingGameSimView.prototype.events, {
        'click #object-tree' : 'treeSelected',
        'click #object-rock' : 'rockSelected',
        'click .reset-btn'   : 'reset'
    }),

    /**
     * Template for rendering the basic scaffolding
     */
    template: _.template(simHtml),
    playbackControlsTemplate: _.template(playbackControlsHtml),

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Measurement',
            name: 'measurement'
        }, options);

        RadioactiveDatingGameSimView.prototype.initialize.apply(this, [options]);

        this.listenTo(this.simulation, 'reset', this.updateTime);
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new MeasurementSimulation({
            paused: true
        });
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new MeasurementSceneView({
            simulation: this.simulation
        });
    },

    render: function() {
        RadioactiveDatingGameSimView.prototype.render.apply(this, arguments);

        this.$time = this.$('.time');
    },

    /**
     * Renders page content. Should be overriden by child classes
     */
    renderScaffolding: function() {
        var data = {
            Constants: Constants,
            simulation: this.simulation,
            Assets: Assets,
            objects: [{
                name: 'tree',
                label: 'Tree',
                src: Assets.Images.TREE_1,
                isDefault: true
            }, {
                name: 'rock',
                label: 'Rock',
                src: Assets.Images.ROCK_A_2
            }]
        };
        this.$el.html(this.template(data));
        this.$('select');
    },

    /**
     * Renders everything
     */
    postRender: function() {
        RadioactiveDatingGameSimView.prototype.postRender.apply(this, arguments);

        return this;
    },

    reset: function() {
        this.simulation.reset();
    },

    update: function(time, deltaTime) {
        RadioactiveDatingGameSimView.prototype.update.apply(this, arguments);

        this.updateTime();
    },

    updateTime: function() {
        this.$time.html(TimeFormatter.formatTime(this.simulation.getAdjustedTime(), true));
    },

    treeSelected: function() {
        this.simulation.set('mode', MeasurementSimulation.MODE_TREE);
    },

    rockSelected: function() {
        this.simulation.set('mode', MeasurementSimulation.MODE_ROCK);
    },

    setSoundVolumeMute: function() {
        this.sceneView.setSoundVolumeMute();
    },

    setSoundVolumeLow: function() {
        this.sceneView.setSoundVolumeLow();
    },

    setSoundVolumeHigh: function() {
        this.sceneView.setSoundVolumeHigh();
    }

});

export default MeasurementSimView;
