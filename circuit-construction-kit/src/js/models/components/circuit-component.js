import _ from 'underscore';
import Vector2 from 'common/math/vector2';
import Branch from 'models/branch';
import Junction from 'models/junction';

/**
 * The base model for all circuit components
 */
var CircuitComponent = Branch.extend({

    defaults: _.extend({}, Branch.prototype.defaults, {
        length: 1,
        height: 0
    }),

    initialize: function(attributes, options) {
        if (options && options.start !== undefined && options.direction !== undefined) {
            if (!attributes.startJunction) {
                this.set('startJunction', new Junction({
                    position: options.start
                }));
            }
            if (!attributes.endJunction) {
                this.set('endJunction', new Junction({
                    position: new Vector2(options.direction)
                        .normalize()
                        .scale(this.get('length'))
                        .add(options.start)
                }));
            }
        }

        Branch.prototype.initialize.apply(this, [attributes, options]);

        this.initShape(this.get('length'), this.get('height'));
    },

    getLength: function() {
        return this.get('length');
    },

    getComponentLength: function() {
        return this.getLength();
    }

});

export default CircuitComponent;