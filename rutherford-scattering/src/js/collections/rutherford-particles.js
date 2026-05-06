
define(function (require) {

    'use strict';


    var RutherfordParticle = require('rutherford-scattering/models/rutherford-particle');
    var AlphaParticles  = require('rutherford-scattering/collections/alpha-particles');

    var RutherfordParticles = AlphaParticles.extend({
        model: RutherfordParticle
    });

    return RutherfordParticles;
});
