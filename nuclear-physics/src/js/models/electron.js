define(function (require) {

    'use strict';


    var SubatomicParticle = require('models/subatomic-particle');

    /**
     * An electron
     */
    var Electron = SubatomicParticle.extend();

    return Electron;
});
