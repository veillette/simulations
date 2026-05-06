'use strict';

var TEST_FILE_REGEX = /^\/base\/test\/tests\/.*\.js$/;
var tests = [];

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_FILE_REGEX.test(file)) {
        tests.push(file.replace(/^\/base\//, '').replace(/\.js$/, ''));
    }
});

require.config({
    baseUrl: '/base',
    callback: function() {
        require(['test/config'], function() {
            require.config({
                deps: tests,
                callback: window.__karma__.start
            });
        });
    }
});
