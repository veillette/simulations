import AtomicNucleus from 'models/atomic-nucleus';

/**
 * This class represents a model element that is generally the product
 *   of a fission reaction.  This is a non-composite nucleus, meaning
 *   that it does not create or keep track of constituent nucleons.
 */
var DaughterNucleus = AtomicNucleus.extend();

export default DaughterNucleus;