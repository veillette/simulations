import _ from 'underscore';
import SAT from 'sat';
import PositionableObject from 'common/models/positionable-object';
import Constants from 'constants';

var silent = { silent: true };

/**
 * A junction in the circuit connecting two branches (like the nodes in a graph).
 */
var Junction = PositionableObject.extend({

    defaults: _.extend({}, PositionableObject.prototype.defaults, {
        selected: false,
        // Voltage relative to reference node. To be used in computing
        //   potential drops, to avoid graph traversal.
        voltage: 0
    }),

    initialize: function(attributes, options) {
        PositionableObject.prototype.initialize.apply(this, arguments);

        this.initShape();
    },

    initShape: function() {
        this.shape = new SAT.Circle(new SAT.Vector(0, 0), this.getRadius() * Constants.SAT_SCALE);
    },

    updateShape: function() {
        this.shape.pos.x = this.get('position').x * Constants.SAT_SCALE;
        this.shape.pos.y = this.get('position').y * Constants.SAT_SCALE;
    },

    getShape: function() {
        this.updateShape();
        return this.shape;
    },

    getRadius: function() {
        return Constants.JUNCTION_RADIUS * 1.1;
    },

    intersectsPolygon: function(polygon) {
        return SAT.testPolygonCircle(polygon, this.getShape());
    },

    translateSilent: function(x, y) {
        this.translate(x, y, silent);
    },

    getDistance: function(junction) {
        return this.get('position').distance(junction.get('position'));
    },

    select: function() {
        this.set('selected', true);
    },

    deselect: function() {
        this.set('selected', false);
    }

});

export default Junction;