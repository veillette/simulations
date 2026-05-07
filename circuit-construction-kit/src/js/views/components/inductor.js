import RectangularComponentView from 'views/components/rectangular';
import Assets from 'assets';

/**
 * A view that represents a resistor
 */
var InductorView = RectangularComponentView.extend({

    imagePath:     Assets.Images.INDUCTOR,
    maskImagePath: Assets.Images.INDUCTOR_MASK,

    schematicImagePath:     Assets.Images.SCHEMATIC_INDUCTOR,
    schematicMaskImagePath: Assets.Images.SCHEMATIC_INDUCTOR_MASK,

    /**
     * Initializes the new InductorView.
     */
    initialize: function(options) {
        RectangularComponentView.prototype.initialize.apply(this, [options]);
    },

    getLabelText: function() {
        return this.model.get('inductance').toFixed(2) + ' Henries';
    }

});

export default InductorView;
