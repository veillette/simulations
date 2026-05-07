import _ from 'underscore';
import Propagator from 'models/propagator';
import NorthBouncePropagator from 'models/propagator/north-bounce';
import SouthBouncePropagator from 'models/propagator/south-bounce';
import EastBouncePropagator from 'models/propagator/east-bounce';
import WestBouncePropagator from 'models/propagator/west-bounce';

/**
 * Keeps a particle within four bounding walls.
 */
var FourBoundsPropagator = function(x, y, w, h, distanceFromWall) {
    this.n = new NorthBouncePropagator(y,     distanceFromWall);
    this.s = new SouthBouncePropagator(y + h, distanceFromWall);
    this.e = new EastBouncePropagator( x + w, distanceFromWall);
    this.w = new WestBouncePropagator( x,     distanceFromWall);
};

/**
 * Instance functions/properties
 */
_.extend(FourBoundsPropagator.prototype, Propagator.prototype, {

    propagate: function(deltaTime, particle) {
        this.n.propagate(deltaTime, particle);
        this.e.propagate(deltaTime, particle);
        this.w.propagate(deltaTime, particle);
        this.s.propagate(deltaTime, particle);
    }

});

export default FourBoundsPropagator;
