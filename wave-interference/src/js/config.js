(function () {
	'use strict';

	var config = {
		paths: {
			jquery:     '../../node_modules/jquery/dist/jquery',
			underscore: '../../bower_components/lodash/dist/lodash',
			backbone:   '../../node_modules/backbone/backbone',
			bootstrap:  '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min',
			text:       '../../node_modules/requirejs-text/text',
			pixi:       '../../../common/node_modules/pixi.js/dist/pixi',
			nouislider: '../../bower_components/nouislider/distribute/jquery.nouislider.all.min',
			timbre:     '../../bower_components/timbre/timbre.dev',
			glmatrix:   '../../bower_components/gl-matrix/dist/gl-matrix',

			views:      '../js/views',
			models:     '../js/models',
			assets:     '../js/assets',
			constants:  '../js/constants',
			templates:  '../templates',
			styles:     '../styles',
			common:     '../../../common'
		},

		packages: [{
			name: 'css',
			location: '../../bower_components/require-css',
			main: 'css'
		}, {
			name: 'less',
			location: '../../bower_components/require-less',
			main: 'less'
		}],

		less: {
		    logLevel: 1,
            async: true,

		    globalVars: {
		        dependencyDir: '"/bower_components"'
		    }
		},
	

        shim: {
            'pixi': {
                exports: 'PIXI'
            }
        }};

	// Dual export: CJS for Gruntfile (Node), RequireJS config for browser AMD loader.
	// ESM migration: replace this block with `export default config;` and update
	// main.js to use static `import` instead of `require(['config'], ...)`.
	if (typeof module !== 'undefined') {
		module.exports = config;
	} else if (typeof require !== 'undefined' && require.config) {
		require.config(config);
	}
})();