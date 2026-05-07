import _ from 'underscore';
import Atom from 'models/atom';
import Constants from 'constants';

/**
 * Class that represents a carbon atom.
 */
var OxygenAtom = Atom.extend({

    defaults: _.extend({}, Atom.prototype.defaults, {
        radius: Constants.OxygenAtom.RADIUS,
        mass:   Constants.OxygenAtom.MASS,
        color:  Constants.OxygenAtom.COLOR
    })

}, Constants.OxygenAtom);

export default OxygenAtom;
