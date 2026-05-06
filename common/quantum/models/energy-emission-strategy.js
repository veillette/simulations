import _ from 'underscore';
import Backbone from 'backbone';

/**
 * Strategy for atoms emitting energy
 */
var EnergyEmissionStrategy = function() {};

_.extend(EnergyEmissionStrategy.prototype, {

    emitEnergy: function(atom) {}

});

EnergyEmissionStrategy.extend = Backbone.Model.extend;

export default EnergyEmissionStrategy;
