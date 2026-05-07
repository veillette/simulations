import RectangularComponentView from 'views/components/rectangular';
import Assets from 'assets';

/**
 * A view that represents a capacitor
 */
var CapacitorView = RectangularComponentView.extend({

    imagePath:     Assets.Images.CAPACITOR,
    maskImagePath: Assets.Images.CAPACITOR_MASK,

    schematicImagePath:     Assets.Images.SCHEMATIC_CAPACITOR,
    schematicMaskImagePath: Assets.Images.SCHEMATIC_CAPACITOR_MASK,

    /**
     * Initializes the new CapacitorView.
     */
    initialize: function(options) {
        RectangularComponentView.prototype.initialize.apply(this, [options]);
    },

    getLabelText: function() {
        return this.model.get('capacitance').toFixed(2) + ' Farads';
    }

});

export default CapacitorView;
