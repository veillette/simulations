import _ from 'underscore';
import PhysicsUtil from 'common/quantum/models/physics-util';
import Photon from 'common/quantum/models/photon';
import EnergyEmissionStrategy from 'common/quantum/models/energy-emission-strategy';
import LaserElementProperties from '../laser-element-properties';
import Constants from '../../constants';
var groundStateEnergy = -13.6;

/**
 * Emission strategy just for this
 */
var EmissionStrategy = EnergyEmissionStrategy.extend({

    emitEnergy: function(atom) {
        return atom.getCurrentState().getNextLowerEnergyState();
    }

});

/**
 * ElementProperties for the 2 level atom in the laser simulation
 */
var ThreeLevelElementProperties = LaserElementProperties.extend({

    defaults: _.extend({}, LaserElementProperties.prototype.defaults, {
        name: 'Laser Atom',
        meanStateLifetime: (Constants.DT / Constants.FPS) * 100,
        energyLevels: [
            groundStateEnergy,
            groundStateEnergy + PhysicsUtil.wavelengthToEnergy(Photon.RED),
            groundStateEnergy + PhysicsUtil.wavelengthToEnergy(Photon.BLUE)
        ],
        energyEmissionStrategy: new EmissionStrategy()
    }),

    getHighEnergyState: function() {
        return this.states[2];
    }

});


export default ThreeLevelElementProperties;
