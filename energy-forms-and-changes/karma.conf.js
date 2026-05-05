'use strict';

module.exports = function(config) {
    config.set({
        basePath: '',

        frameworks: ['requirejs', 'mocha'],

        files: [
            // Source files available to tests (not included as scripts)
            { pattern: 'node_modules/chai/chai.js',  included: false },
            { pattern: 'src/js/**/*.js',              included: false },
            { pattern: 'test/**/*Spec.js',            included: false },
            // RequireJS bootstrap — must be last included file
            'test/karma-main.js',
        ],

        browsers: ['ChromeHeadless'],

        singleRun: true,

        reporters: ['progress'],
    });
};
