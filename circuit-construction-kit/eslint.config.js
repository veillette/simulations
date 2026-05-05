'use strict';

const globals = require('globals');

module.exports = [
    {
        files: ['src/**/*.js'],
        ignores: ['src/js/lib/**/*.js'],
        languageOptions: {
            ecmaVersion: 5,
            sourceType: 'script',
            globals: {
                ...globals.browser,
                require: 'readonly',
                define: 'readonly',
            },
        },
        rules: {
            'guard-for-in':      'error',
            'no-caller':         'error',
            'no-empty':          'error',
            'no-irregular-whitespace': 'error',
            'no-new':            'warn',
            'no-undef':          'error',
            'no-unused-vars':    ['warn', { vars: 'all', args: 'none' }],
            'no-trailing-spaces': 'warn',
            'quotes':            ['error', 'single', { avoidEscape: true }],
            'strict':            ['error', 'function'],
            'complexity':        ['warn', 10],
        },
    },
    {
        files: ['test/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.mocha,
                require: 'readonly',
                define: 'readonly',
            },
        },
    },
];
