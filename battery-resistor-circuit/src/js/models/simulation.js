import _ from 'underscore';
import FixedIntervalSimulation from 'common/simulation/fixed-interval-simulation';
import Vector2 from 'common/math/vector2';
import System from 'models/system';
import Circuit from 'models/circuit';
import WirePatch from 'models/wire-patch';
import WireSystem from 'models/wire-system';
import PatchWireRegion from 'models/wire-region/patch';
import SimplePatchRegion from 'models/wire-region/simple-patch';
import AndWireRegion from 'models/wire-region/and';
import Electron from 'models/wire-particle/electron';
import Resistance from 'models/law/resistance';
import AverageCurrent from 'models/law/average-current';
import CollisionEvent from 'models/law/collision-event';
import Collider from 'models/law/collider';
import ParticleLaw from 'models/law/particle';
import Turnstile from 'models/law/turnstile';
import DualJunctionPropagator from 'models/propagator/dual-junction';
import CompositePropagator from 'models/propagator/composite';
import RangedPropagator from 'models/propagator/ranged';
import ResetElectronPropagator from 'models/propagator/reset-electron';
import SmoothBatteryPropagator from 'models/propagator/smooth-battery';
import BatteryForcePropagator from 'models/propagator/battery-force';
import AccelerationPropagator from 'models/propagator/acceleration';
import CrashPropagator from 'models/propagator/crash';
import FrictionForce from 'models/force/friction';
import CoulombForceParameters from 'models/force/coulomb-force-parameters';
import CoulombForce from 'models/force/coulomb';
import ResetScatterability from 'models/listeners/reset-scatterability';
import OscillateFactory from 'models/oscillate-factory';
import AdjacentPatchCoulombForceEndToBeginning from 'models/force/adjacent-patch-coulomb-beginning-to-end';
import AdjacentPatchCoulombForceBeginningToEnd from 'models/force/adjacent-patch-coulomb-end-to-beginning';
import Constants from 'constants';

/**
 * Wraps the update function in
 */
var BRCSimulation = FixedIntervalSimulation.extend({

    defaults: _.extend(FixedIntervalSimulation.prototype.defaults, {
        coreCount: Constants.RESISTANCE_RANGE.defaultValue,
        voltage: Constants.VOLTAGE_RANGE.defaultValue,
        current: 0
    }),

    initialize: function(attributes, options) {
        options = _.extend({
            frameDuration: Constants.FRAME_DURATION,
            deltaTimePerFrame: Constants.DT_PER_FRAME
        }, options);

        // Not really the way to do it in Backbone, but an easier solution when porting than debugging later
        this.voltageListeners = [];
        this.currentListeners = [];
        this.coreCountListeners = [];

        FixedIntervalSimulation.prototype.initialize.apply(this, [attributes, options]);

        this.on('change:voltage',   this.voltageChanged);
        this.on('change:current',   this.currentChanged);
        this.on('change:coreCount', this.coreCountChanged);
    },

    /**
     * Initializes the models used in the simulation
     */
    initComponents: function() {
        // TODO: Break this thing into smaller functions as soon as I know it all works

        var moveRight = Constants.X_SHIFT;
        var scatInset = 60 + moveRight;
        var battInset = scatInset;
        var topLeftWirePoint     = new Vector2(Constants.LEFT_WIRE_X,  Constants.TOP_WIRE_Y);    // Top left
        var topRightWirePoint    = new Vector2(Constants.RIGHT_WIRE_X, Constants.TOP_WIRE_Y);    // Top right
        var bottomRightWirePoint = new Vector2(Constants.RIGHT_WIRE_X, Constants.BOTTOM_WIRE_Y); // Bottom right
        var bottomLeftWirePoint  = new Vector2(Constants.LEFT_WIRE_X,  Constants.BOTTOM_WIRE_Y); // Bottom left
        var topLeftInset         = new Vector2(topLeftWirePoint    ).add( scatInset - moveRight, 0);
        var topRightInset        = new Vector2(topRightWirePoint   ).add(-scatInset + moveRight, 0);
        var bottomLeftInset      = new Vector2(bottomLeftWirePoint ).add( battInset - moveRight, 0);
        var bottomRightInset     = new Vector2(bottomRightWirePoint).add(-battInset + moveRight, 0);

        // Set up the wire patches
        var loopWirePatch = new WirePatch()
            .startSegmentBetween(bottomLeftInset, bottomLeftWirePoint)
            .appendSegmentAt(topLeftWirePoint)
            .appendSegmentAt(topRightWirePoint)
            .appendSegmentAt(bottomRightWirePoint)
            .appendSegmentAt(bottomRightInset);

        var batteryWirePatch = new WirePatch()
            .startSegmentBetween(bottomRightInset, bottomLeftInset);

        this.batteryWirePatch = batteryWirePatch;

        // Patches that will be used for painting (and  aren't actually used in the simulation)
        var scatterPatch = new WirePatch()
            .startSegmentBetween(topLeftInset, topRightInset);

        var leftPatch = new WirePatch()
            .startSegmentBetween(bottomLeftInset, bottomLeftWirePoint)
            .appendSegmentAt(topLeftWirePoint)
            .appendSegmentAt(topLeftInset);

        var rightPatch = new WirePatch()
            .startSegmentBetween(topRightInset, topRightWirePoint)
            .appendSegmentAt(bottomRightWirePoint)
            .appendSegmentAt(bottomRightInset);

        this.scatterPatch = scatterPatch;
        this.leftPatch = leftPatch;
        this.rightPatch = rightPatch;

        // Create the circuit and add the real (used by the simulation) patches
        var circuit = new Circuit()
            .addWirePatch(loopWirePatch)
            .addWirePatch(batteryWirePatch);

        // Set up the wire system
        var wireSystem = new WireSystem();
        this.wireSystem = wireSystem;

        var props = new CompositePropagator();

        // Create the system which will be representative of the resistor
        var system = new System();
        this.system = system;

        var resistance = new Resistance(
            Constants.CORE_START,
            Constants.CORE_END,
            Constants.DEFAULT_NUM_CORES,
            loopWirePatch,
            Constants.DEFAULT_AMPLITUDE,
            Constants.DEFAULT_FREQUENCY,
            Constants.DEFAULT_DECAY,
            system
        );
        this.resistance = resistance;

        this.resistorLeft  = topLeftInset.x;
        this.resistorRight = topRightInset.x;
        this.resistorY     = topRightInset.y;

        // Battery stuff
        var batteryRegion = new SimplePatchRegion(batteryWirePatch);
        var batteryProps = new CompositePropagator(); // original: cpr
        var batteryRangedProps = new RangedPropagator(); // original: range

        var inset = 50;
        var battL = Constants.CORE_START - inset;
        var battR = Constants.CORE_END   + inset;
        var leftBatteryRegion  = new PatchWireRegion(0, battL, loopWirePatch);
        var rightBatteryRegion = new PatchWireRegion(battR, loopWirePatch.getLength(), loopWirePatch);
        this.batteryLeft  = bottomLeftInset.x;
        this.batteryRight = bottomRightInset.x;
        this.batteryY = bottomLeftInset.y;

        var batterySpeed = 35;
        var battery = new SmoothBatteryPropagator(leftBatteryRegion, rightBatteryRegion, wireSystem, batterySpeed, 18);
        this.battery = battery;

        batteryRangedProps.addPropagator(batteryRegion, battery);
        batteryRangedProps.addPropagator(batteryRegion, new ResetElectronPropagator());
        batteryProps.addPropagator(batteryRangedProps);
        batteryProps.addPropagator(new CrashPropagator());
        props.addPropagator(batteryProps);

        var coulombForceParameters = new CoulombForceParameters(Constants.K, Constants.COULOMB_POWER, 2); // original: cfp
        var coulombForce = new CoulombForce(coulombForceParameters, wireSystem); // original: cf

        var batteryForcePropagator = new BatteryForcePropagator(0, 10 * Constants.MAX_VEL); // original: fp
        batteryForcePropagator.addForce(coulombForce);
        // Add a coulomb force from the end of batteryWirePatch onto the beginning of loopWirePatch
        batteryForcePropagator.addForce(new AdjacentPatchCoulombForceEndToBeginning(coulombForceParameters, wireSystem, batteryWirePatch, loopWirePatch));
        batteryForcePropagator.addForce(new AdjacentPatchCoulombForceBeginningToEnd(coulombForceParameters, wireSystem, batteryWirePatch, loopWirePatch));
        batteryForcePropagator.addForce(new FrictionForce(0.9999999));

        var accelInset = 15;
        var coulombInset = 10;
        var accelerationRegion        = new PatchWireRegion(Constants.CORE_START - accelInset,   Constants.CORE_END + accelInset,   loopWirePatch);
        var scatteringRegionNoCoulomb = new PatchWireRegion(Constants.CORE_START - coulombInset, Constants.CORE_END + coulombInset, loopWirePatch);

        var nonCoulombRegion = new AndWireRegion();
        nonCoulombRegion.addRegion(batteryRegion);
        nonCoulombRegion.addRegion(scatteringRegionNoCoulomb);  // PhET Note: Comment out this line to put coulomb interactions into the scattering region

        var accelScale = 1.4;
        var scatProp = new AccelerationPropagator(2, Constants.MAX_VEL * 15, accelScale);
        batteryRangedProps.addPropagator(accelerationRegion, scatProp);
        batteryRangedProps.addInverse(nonCoulombRegion, batteryForcePropagator);
        props.addPropagator(new DualJunctionPropagator(loopWirePatch, batteryWirePatch));
        props.addPropagator(new DualJunctionPropagator(batteryWirePatch, loopWirePatch));

        var resetScatterability = new ResetScatterability(wireSystem); // original: rs

        // Average current calculator
        var averageCurrent = new AverageCurrent(100); // original: current
        this.averageCurrent = averageCurrent;

        // Collider stuff
        resistance.layoutCores();
        var axis = new Vector2(1, 2);
        var oscillateFactory = new OscillateFactory(
            Constants.V_TO_AMP_SCALE,
            Constants.DEFAULT_DECAY,
            Constants.DEFAULT_FREQUENCY,
            Constants.MAX_ACC,
            axis
        );
        var collisionEvent = new CollisionEvent(Constants.COLLISION_DIST, Constants.AMPLITUDE_THRESHOLD, oscillateFactory);
        system.addLaw(collisionEvent);
        var collider = new Collider(wireSystem, collisionEvent, loopWirePatch);

        // Create and add electrons
        var dx = parseInt(circuit.getLength() / Constants.NUM_ELECTRONS);
        var mod = 0;
        for (var i = 0; i < Constants.NUM_ELECTRONS; i++) {
            var position = dx * i;

            if (position > Constants.CORE_START && position < Constants.CORE_END && mod++ % 2 === 0)
                continue;

            var electron = new Electron({
                propagator: props,
                wirePatch: circuit.getPatch(position),
                collisionEvent: collisionEvent,
                velocity: 0,
                position: circuit.getLocalPosition(position, circuit.getPatch(position))
            });

            wireSystem.addParticle(electron);
        }

        // Add some laws
        system.addLaw(wireSystem);
        system.addLaw(collider);
        system.addLaw(new ParticleLaw());
        system.addLaw(averageCurrent);

        // Turnstile (the pinwheel)
        var turnstile = new Turnstile(Constants.TURNSTILE_CENTER, Constants.TURNSTILE_SPEED_SCALE);
        this.turnstile = turnstile;
        system.addLaw(turnstile);

        // Add listeners
        this.voltageListeners.push(battery);
        this.voltageListeners.push(averageCurrent);
        this.voltageListeners.push(scatProp);
        this.voltageListeners.push(batteryForcePropagator);
        this.voltageListeners.push(resetScatterability);

        this.currentListeners.push(turnstile);

        this.coreCountListeners.push(resistance);
        this.coreCountListeners.push(averageCurrent);
        this.coreCountListeners.push(battery);

        // Trigger changes for default values
        this.voltageChanged(this, this.get('voltage'));
        this.currentChanged(this, this.get('current'));
        this.coreCountChanged(this, this.get('coreCount'));
    },

    _update: function(time, deltaTime) {
        this.system.update(deltaTime);

        // TODO: Might need to change this later, but just adding it in here so I don't forget
        this.set('current', this.averageCurrent.getCurrent());
    },

    voltageChanged: function(simulation, voltage) {
        for (var i = 0; i < this.voltageListeners.length; i++)
            this.voltageListeners[i].voltageChanged(voltage);
    },

    currentChanged: function(simulation, current) {
        for (var i = 0; i < this.currentListeners.length; i++)
            this.currentListeners[i].currentChanged(current);
    },

    coreCountChanged: function(simulation, coreCount) {
        for (var i = 0; i < this.coreCountListeners.length; i++)
            this.coreCountListeners[i].coreCountChanged(coreCount);
    }

});

export default BRCSimulation;
