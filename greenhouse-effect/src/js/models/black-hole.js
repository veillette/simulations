define(function (require) {

    'use strict';
    
    var Rectangle = require('common/math/rectangle');

    var PhotonAbsorber = require('models/photon-absorber');

    /**
     * 
     */
    var BlackHole = PhotonAbsorber.extend({

        /**
         * Requires a simulation model instance to be specified in
         *   the options as 'simulation'.
         */
        initialize: function(attributes, options) {
            PhotonAbsorber.prototype.initialize.apply(this, arguments);

            this.simulation = options.simulation;

            this.eventHorizon = new Rectangle(
                this.simulation.bounds.x - 10,
                this.simulation.bounds.y - 10,
                this.simulation.bounds.w + 20,
                this.simulation.bounds.h + 20
            );
        },

        update: function(deltaTime) {
            // If photon is way outside the view, delete it
            var photons = this.simulation.photons;
            var photon;
            for (var i = photons.length - 1; i >= 0; i--) {
                photon = photons[i];
                if (!this.eventHorizon.contains(photon.get('position')))
                    this.simulation.removePhoton(i);
            }
        }

    });

    return BlackHole;
});
