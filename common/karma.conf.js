/* eslint-disable no-undef */
'use strict';

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'requirejs'],
        files: [
            'node_modules/chai/chai.js',
            'node_modules/sinon/pkg/sinon.js',
            { pattern: '{app,bar-graph,binarysearch,collections,colors,controls,dom,graph,help-label,locks,math,mechanics,models,pixi,pooled-object,quantum,simulation,tools,updater}/**/*.js', included: false },
            { pattern: 'pool.js', included: false },
            { pattern: 'test/**/*.js', included: false },
            'test/karma-main.js'
        ],
        browsers: ['ChromeHeadless'],
        singleRun: true,
        reporters: ['progress']
    });
};
