define(function (require) {

	'use strict';

	var Simulation = require('simulation');

	/**
	 * Wraps the update function in 
	 */
	var FixedIntervalSimulation = Simulation.extend({

		/**
		 *
		 */
		initialize: function(attributes, options) {
			Simulation.prototype.initialize.apply(this, [attributes, options]);

			this.timestep = 1000 / 30; // milliseconds, from PhET's WaveInterferenceClock
			this.accumulator = 0;
		},

		/**
		 * Because we need to update the simulation on a fixed interval
		 *   for accuracy--especially since the propagator isn't based
		 *   off of time but acts in discrete steps--we need a way to
		 *   keep track of step intervals independent of the varying
		 *   intervals created by window.requestAnimationFrame. This 
		 *   clever solution was found here: 
		 *
		 *   http://gamesfromwithin.com/casey-and-the-clearly-deterministic-contraptions
		 */
		update: function(time, delta) {

			if (!this.paused) {
				this.accumulator += delta;

				while (this.accumulator >= this.timestep) {
					this.time += this.timestep;

					this._update();
					
					this.accumulator -= this.timestep;
				}	
			}
			
		}

	});

	return FixedIntervalSimulation;
});
