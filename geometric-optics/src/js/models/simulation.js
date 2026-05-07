import _ from 'underscore';
import Simulation from 'common/simulation/simulation';
import Lens from 'models/lens';
import SourceObject from 'models/source-object';
import TargetImage from 'models/target-image';
import Constants from 'constants';

/**
 * Wraps the update function in
 */
var GeometricOpticsSimulation = Simulation.extend({

    defaults: _.extend(Simulation.prototype.defaults, {

    }),

    initialize: function(attributes, options) {
        Simulation.prototype.initialize.apply(this, [attributes, options]);

    },

    /**
     * Initializes the models used in the simulation
     */
    initComponents: function() {
        this.lens = new Lens();

        this.sourceObject = new SourceObject({
            position:    Constants.DEFAULT_SOURCE_POINT_1,
            secondPoint: Constants.DEFAULT_SOURCE_POINT_2
        });

        this.targetImage = new TargetImage({}, {
            lens:         this.lens,
            sourceObject: this.sourceObject
        });
    }

});

export default GeometricOpticsSimulation;
