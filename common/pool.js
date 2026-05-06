/**
 * Minimal object pool factory — drop-in replacement for the `object-pool` npm
 * package.  The only API used across the codebase is:
 *
 *   var pool = Pool({ init: fn, enable: fn });
 *   var obj  = pool.create();
 *   pool.remove(obj);
 */
define(function () {

    'use strict';

    /**
     * @param {Object} [config]
     * @param {Function} [config.init]   Called once to create a new instance.
     * @param {Function} [config.enable] Called each time an instance is reused.
     */
    function Pool(config) {
        var available = [];
        var init   = (config && config.init)   || function () { return {}; };
        var enable = (config && config.enable) || null;

        return {
            create: function () {
                var obj = available.length > 0 ? available.pop() : init();
                if (enable) enable(obj);
                return obj;
            },
            remove: function (obj) {
                available.push(obj);
            }
        };
    }

    return Pool;
});
