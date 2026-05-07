import _ from 'underscore';
import Atom from 'models/atom';
import Constants from 'constants';

/**
 * Class that represents a carbon atom.
 */
var CarbonAtom = Atom.extend({

    defaults: _.extend({}, Atom.prototype.defaults, {
        radius: Constants.CarbonAtom.RADIUS,
        mass:   Constants.CarbonAtom.MASS,
        color:  Constants.CarbonAtom.COLOR
    })

}, Constants.CarbonAtom);

export default CarbonAtom;
