import _ from 'underscore';
import Law from 'models/law';
import Core from 'models/free-particle/core';

/**
 *
 */
var Collider = function(wireSystem, collisionEvent, wirePatch) {
    this.wireSystem = wireSystem;
    this.collisionEvent = collisionEvent;
    this.wirePatch = wirePatch;
};

/**
 * Instance functions/properties
 */
_.extend(Collider.prototype, Law.prototype, {

    update: function(deltaTime, system) {
        var wireParticles = this.wireSystem.particles;

        for (var i = 0; i < system.particles.length; i++ ) {
            if (system.particles[i] instanceof Core) {
                var core = system.particles[i];
                for (var k = 0; k < wireParticles.length; k++) {
                    if (wireParticles[k].wirePatch == this.wirePatch)
                        this.collisionEvent.collide(core, wireParticles[k]);
                }
            }
        }
    }

});

export default Collider;
