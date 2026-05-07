import _ from 'underscore';
import Atom from 'models/atom';
import Constants from 'constants';

/**
 * Class that represents a carbon atom.
 */
var HydrogenAtom = Atom.extend({

    defaults: _.extend({}, Atom.prototype.defaults, {
        radius: Constants.HydrogenAtom.RADIUS,
        mass:   Constants.HydrogenAtom.MASS,
        color:  Constants.HydrogenAtom.COLOR
    })

}, Constants.HydrogenAtom);

export default HydrogenAtom;
