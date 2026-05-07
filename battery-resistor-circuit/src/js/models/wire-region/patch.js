import _ from 'underscore';
import WireRegion from 'models/wire-region';

/**
 *
 */
var PatchWireRegion = function(min, max, wirePatch) {
    this.min = min;
    this.max = max;
    this.wirePatch = wirePatch;
};

/**
 * Instance functions/properties
 */
_.extend(PatchWireRegion.prototype, WireRegion.prototype, {

    contains: function(wireParticle) {
        return (
            wireParticle.wirePatch === this.wirePatch &&
            this.max >= wireParticle.position &&
            this.min <= wireParticle.position
        );
    }

});

export default PatchWireRegion;
