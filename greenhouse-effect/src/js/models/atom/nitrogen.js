import _ from 'underscore';
import Atom from 'models/atom';
import Constants from 'constants';

/**
 * Class that represents a carbon atom.
 */
var NitrogenAtom = Atom.extend({

    defaults: _.extend({}, Atom.prototype.defaults, {
        radius: Constants.NitrogenAtom.RADIUS,
        mass:   Constants.NitrogenAtom.MASS,
        color:  Constants.NitrogenAtom.COLOR
    })

}, Constants.NitrogenAtom);

export default NitrogenAtom;
