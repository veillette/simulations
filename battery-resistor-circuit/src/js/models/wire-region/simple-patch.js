import _ from 'underscore';
import WireRegion from 'models/wire-region';

/**
 *
 */
var SimplePatchWireRegion = function(wirePatch) {
    this.wirePatch = wirePatch;
};

/**
 * Instance functions/properties
 */
_.extend(SimplePatchWireRegion.prototype, WireRegion.prototype, {

    contains: function(wireParticle) {
        return (wireParticle.wirePatch === this.wirePatch);
    }

});

export default SimplePatchWireRegion;
