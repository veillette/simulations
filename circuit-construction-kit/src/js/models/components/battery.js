import _ from 'underscore';
import CircuitComponent from 'models/components/circuit-component';
import Constants from 'constants';

/**
 * A battery
 */
var Battery = CircuitComponent.extend({

    defaults: _.extend({}, CircuitComponent.prototype.defaults, {
        voltageDrop: 9,
        internalResistance: undefined,
        internalResistanceOn: undefined,
        kirkhoffEnabled: false,
        length: 1,
        height: 1
    }),

    initialize: function(attributes, options) {
        CircuitComponent.prototype.initialize.apply(this, [attributes, options]);

        this.set('resistance', this.get('internalResistance'));

        this.on('change:internalResistanceOn', this.internalResistanceOnChanged);
    },

    getEffectiveVoltageDrop: function() {
        return this.getVoltageDrop() - this.get('current') * this.get('resistance');
    },

    internalResistanceOnChanged: function(model, internalResistanceOn) {
        if (internalResistanceOn)
            this.set('resistance', this.get('internalResistance'));
        else
            this.set('resistance', Constants.MIN_RESISTANCE);
    },

    reverse: function() {
        this.set({
            startJunction: this.get('endJunction'),
            endJunction: this.get('startJunction')
        });
        this.trigger('reversed');
    }

}, Constants.Battery);

export default Battery;