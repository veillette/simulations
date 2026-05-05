'use strict';

// Collect all test spec files karma has loaded
var specFiles = Object.keys(window.__karma__.files).filter(function(file) {
    return /Spec\.js$/.test(file);
}).map(function(file) {
    return file.replace(/^\/base\//, '').replace(/\.js$/, '');
});

require.config({
    baseUrl: '/base/src/js',

    paths: {
        chai: '/base/node_modules/chai/chai',
    },

    deps: specFiles,
    callback: window.__karma__.start,
});
