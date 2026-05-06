define(['css'], function(css) {
    'use strict';
    return {
        normalize: function(name, normalize) {
            if (name.substr(name.length - 5) === '.less')
                name = name.substr(0, name.length - 5);
            return normalize(name);
        },
        load: function(lessId, req, load, config) {
            css.load(lessId, req, load, config);
        }
    };
});
