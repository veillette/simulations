import _ from 'underscore';
import RutherfordScatteringSimView from 'rutherford-scattering/views/sim';
import PlumPuddingSceneView from 'rutherford-scattering/views/scene/plum-pudding';
import PlumPuddingSimulation from 'rutherford-scattering/models/simulation/plum-pudding';

/**
 * Extends the functionality of the RutherfordScattering to create
 *   the Rutherford Atom tab.
 */
var PlumPuddingView = RutherfordScatteringSimView.extend({

    events: _.extend(RutherfordScatteringSimView.prototype.events, {

    }),

    initialize: function(options) {
        options = _.extend({
            title: 'Plum Pudding Atom',
            name:  'plum-pudding-atom'
        }, options);

        this.showAtomProperties = false;

        RutherfordScatteringSimView.prototype.initialize.apply(this, [ options ]);
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new PlumPuddingSceneView({
            simulation: this.simulation
        });
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new PlumPuddingSimulation();
    }

});

export default PlumPuddingView;