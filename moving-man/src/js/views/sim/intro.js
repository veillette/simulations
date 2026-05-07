import _ from 'underscore';
import MovingManSimulation from 'models/moving-man-simulation';
import MovingManSimView from 'views/sim';
import playbackControlsHtml from 'templates/intro-controls.html?raw';
import 'styles/playback-controls.css';

/**
 * Extends the functionality of the MovingManSimView to create
 *   the Intro tab. This one is a very simple view, so not much
 *   additional functionality is needed.
 */
var IntroSimView = MovingManSimView.extend({

    events: _.extend(MovingManSimView.prototype.events, {

    }),

    initialize: function(options) {
        options = _.extend({
            title: 'Introduction',
            name:  'intro'
        }, options);

        MovingManSimView.prototype.initialize.apply(this, [ options ]);

        this.listenTo(this.simulation, 'change:paused', this.pausedChanged);
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new MovingManSimulation({
            paused: true
        }, {
            noRecording: true
        });
    },

    /**
     * Renders everything
     */
    render: function() {
        MovingManSimView.prototype.render.apply(this);

        this.renderPlaybackControls();

        this.simulation.trigger('change:paused');

        return this;
    },

    /**
     * Renders the playback controls
     */
    renderPlaybackControls: function() {
        this.$('.playback-controls-placeholder').replaceWith(playbackControlsHtml);
    }

});

export default IntroSimView;
