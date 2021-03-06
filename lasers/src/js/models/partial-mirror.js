define(function (require) {

    'use strict';

    var PartialReflectionStrategy = require('models/reflection-strategy/partial');
    var Mirror                    = require('models/mirror');

    /**
     * This class represents partially reflecting mirror.
     */
    var PartialMirror = Mirror.extend({

        defaults: {
            reflectivity: 1
        },

        /**
         * Initializes the PartialMirror object
         */
        initialize: function(attributes, options) {
            Mirror.prototype.initialize.apply(this, [attributes, options]);

            var partialStrategy = new PartialReflectionStrategy(this.get('reflectivity'));
            this.addReflectionStrategy(partialStrategy);

            this.on('change:reflectivity', this.reflectivityChanged);
        },

        addReflectionStrategy: function(strategy) {
            // If the strategy being added is a reflecting strategy, remove the old one
            if (strategy instanceof PartialReflectionStrategy) {
                this.partialStrategy = strategy;
                for (var i = 0; i < this.reflectionStrategies.length; i++) {
                    if (this.reflectionStrategies[i] instanceof PartialReflectionStrategy) {
                        this.reflectionStrategies.remove(this.reflectionStrategies[i]);
                        break;
                    }
                }
            }

            this.reflectionStrategies.push(strategy);
        },

        reflectivityChanged: function(model, reflectivity) {
            this.partialStrategy.setReflectivity(reflectivity);
        },

        getReflectivity: function() {
            return this.get('reflectivity');
        },

        setReflectivity: function(reflectivity) {
            this.set('reflectivity', reflectivity);
        }

    });

    return PartialMirror;
});