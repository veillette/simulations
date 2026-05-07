import _ from 'underscore';
import Vector2 from 'common/math/vector2';
import SeriesAmmeter from 'models/components/series-ammeter';
import Junction from 'models/junction';
import SeriesAmmeterView from 'views/components/series-ammeter';
import ComponentToolboxIcon from 'views/component-toolbox-icon';
import Assets from 'assets';

/**
 * A visual representation of some kind of object supply.  The
 *   user creates new objects with this view.  Dragging from
 *   the view creates a new object and places it in the scene,
 *   while dragging an existing object back onto this view
 *   destroys it.
 */
var SeriesAmmeterToolboxIcon = ComponentToolboxIcon.extend({

    initialize: function(options) {
        options = _.extend({
            labelText: 'Ammeter'
        }, options);

        ComponentToolboxIcon.prototype.initialize.apply(this, [options]);
    },

    /**
     * Returns the icon sprite
     */
    createIconSprite: function() {
        return Assets.createSprite(Assets.Images.SERIES_AMMETER_ICON);
    },

    /**
     * Returns the schematic-mode icon sprite
     */
    createSchematicIconSprite: function() {
        return Assets.createSprite(Assets.Images.SCHEMATIC_SERIES_AMMETER);
    },

    /**
     * Creates a new object of whatever this icon represents
     */
    createComponentView: function(x, y) {
        var L = 2;
        var H = 0.6;

        var model = new SeriesAmmeter({
            startJunction: new Junction({ position: new Vector2(0, 0) }),
            endJunction:   new Junction({ position: new Vector2(L, 0) }),
            length: L,
            height: H
        });
        this.setJunctionPositions(model, x, y);

        var view = new SeriesAmmeterView({
            mvt: this.mvt,
            simulation: this.simulation,
            circuit: this.simulation.circuit,
            model: model
        });
        return view;
    }

});


export default SeriesAmmeterToolboxIcon;
