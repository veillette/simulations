import inputLock from './input';
import updateLock from './update';

/**
 * Function that adds the two functions to a constructor's prototype.
 */
var defineInputUpdateLocks = function(constructor) {
    constructor.prototype.inputLock = inputLock;
    constructor.prototype.updateLock = updateLock;
};

export default defineInputUpdateLocks;