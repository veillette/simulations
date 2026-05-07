import _ from 'underscore';
import CollisionLabSimulation from 'models/simulation';
import CollisionLabSimView from 'views/sim';
import CollisionLabSceneView from 'views/scene';
import BallSettingsView from 'views/ball-settings';
import Constants from 'constants';
import ballSettingsHtml from 'templates/ball-settings-1d.html?raw';


/**
 * Intro tab
 */
var IntroSimView = CollisionLabSimView.extend({

    ballSettingsHtml: ballSettingsHtml,

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Introduction',
            name: 'intro-sim',
            userCanAddRemoveBalls: false
        }, options);

        CollisionLabSimView.prototype.initialize.apply(this, [options]);
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new CollisionLabSimulation({
            defaultBallSettings: Constants.Simulation.INTRO_DEFAULT_BALL_SETTINGS,
            oneDimensional: true,
            borderOn: false
        });
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new CollisionLabSceneView({
            simulation: this.simulation,
            oneDimensional: true
        });
    },

    /**
     * Returns a new ball settings view
     */
    createBallSettingsView: function(ball) {
        return new BallSettingsView({
            model: ball,
            simulation: this.simulation,
            oneDimensional: true,
            showMoreData: this.moreDataMode
        });
    }

});

export default IntroSimView;
