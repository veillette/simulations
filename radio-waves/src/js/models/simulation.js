import _ from 'underscore';
import FixedIntervalSimulation from 'common/simulation/fixed-interval-simulation';
import Vector2 from 'common/math/vector2';
import Antenna from 'models/antenna';
import PositionConstrainedElectron from 'models/electron/position-constrained';
import EmfSensingElectron from 'models/electron/emf-sensing';
import ManualMovementStrategy from 'models/movement-strategy/manual';
import SinusoidalMovementStrategy from 'models/movement-strategy/sinusoidal';
import Constants from 'constants';

/**
 * Wraps the update function in
 */
var RadioWavesSimulation = FixedIntervalSimulation.extend({

    defaults: _.extend(FixedIntervalSimulation.prototype.defaults, {

    }),

    initialize: function(attributes, options) {
        options = _.extend({
            frameDuration: Constants.FRAME_DURATION,
            deltaTimePerFrame: Constants.DT_PER_FRAME
        }, options);

        this.origin = new Vector2(Constants.SIMULATION_ORIGIN.x, Constants.SIMULATION_ORIGIN.y);
        this.bounds = Constants.SIMULATION_BOUNDS;

        FixedIntervalSimulation.prototype.initialize.apply(this, [attributes, options]);
    },

    /**
     * Initializes the models used in the simulation
     */
    initComponents: function() {
        // Create the transmitting antenna
        this.transmittingAntenna = new Antenna(
            new Vector2(this.origin.x, this.origin.y - 100),
            new Vector2(this.origin.x, this.origin.y + 250)
        );

        // Create the transmitting antenna's electron
        this.transmittingElectron = new PositionConstrainedElectron({
            position: new Vector2(this.origin.x, this.origin.y)
        }, {
            positionConstraint: this.transmittingAntenna
        });

        // Create the receiving antenna
        var receivingXOffset = 625;
        this.receivingAntenna = new Antenna(
            new Vector2(this.origin.x + receivingXOffset, this.transmittingElectron.getStartPosition().y - 50),
            new Vector2(this.origin.x + receivingXOffset, this.transmittingElectron.getStartPosition().y + 75)
        );

        // Create the receiving antenna's atom
        this.receivingElectron = new EmfSensingElectron({
            position: new Vector2(this.origin.x + 680, this.transmittingElectron.getStartPosition().y)
        }, {
            positionConstraint: this.receivingAntenna,
            sourceElectron: this.transmittingElectron
        });

        // Create movement strategies
        this.manualMovement     = new ManualMovementStrategy(this.transmittingElectron);
        this.sinusoidalMovement = new SinusoidalMovementStrategy(this.transmittingElectron, Constants.DEFAULT_FREQUENCY, Constants.DEFAULT_AMPLITUDE);
    },

    _update: function(time, deltaTime) {
        this.transmittingElectron.update(time, deltaTime);
        this.receivingElectron.update(time, deltaTime);
        this.trigger('updated');
    },

    setTransmittingElectronMovementStrategyToManual: function() {
        this.transmittingElectron.setMovementStrategy(this.manualMovement);
    },

    setTransmittingElectronMovementStrategyToSinusoidal: function() {
        this.transmittingElectron.setMovementStrategy(this.sinusoidalMovement);
    }

});

export default RadioWavesSimulation;
