import Vector2 from 'common/math/vector2';
import PositionableObject from 'common/models/positionable-object';
import EnergyChunkCollection from 'models/energy-chunk-collection';

/**
 * Basic building block model for all the elements in the intro tab scene
 */
var EnergySystemsElement = PositionableObject.extend({

    defaults: {
        active: false,
        opacity: 0
    },

    initialize: function(attributes, options) {
        PositionableObject.prototype.initialize.apply(this, [attributes, options]);

        this.energyChunks = new EnergyChunkCollection();

        this._translation = new Vector2();

        this.on('change:position', this.positionChanged);
    },

    clearEnergyChunks: function() {
        // Remove and destroy the models
        var chunk;
        for (var i = this.energyChunks.models.length - 1; i >= 0; i--) {
            chunk = this.energyChunks.models[i];
            this.energyChunks.remove(chunk);
            chunk.destroy();
        }
    },

    activate: function() {
        this.set('active', true);
    },

    deactivate: function() {
        this.set('active', false);

        this.clearEnergyChunks();
    },

    active: function() {
        return this.get('active');
    },

    update: function(time, delta) {},

    positionChanged: function(model, position) {
        var translation = this._translation.set(position).sub(model.previous('position'));
        for (var i = this.energyChunks.length - 1; i >= 0; i--) {
            this.energyChunks.models[i].translate(translation);
        }
        // console.log(this.cid + ': ' + position)
    }

});

export default EnergySystemsElement;
