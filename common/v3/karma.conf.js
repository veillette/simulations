/* eslint-disable no-undef */
'use strict';

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'requirejs'],
        files: [
            'node_modules/chai/chai.js',
            'node_modules/sinon/pkg/sinon.js',
            { pattern: '{app,help-label,pixi,tools,updater}/**/*.js', included: false },
            { pattern: 'test/**/*.js', included: false },
            'test/karma-main.js'
        ],
        browsers: ['ChromeHeadless'],
        singleRun: true,
        reporters: ['progress']
    });
};
