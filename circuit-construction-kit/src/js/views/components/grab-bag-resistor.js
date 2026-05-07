import RectangularComponentView from 'views/components/rectangular';
import Constants from 'constants';
import Assets from 'assets';

/**
 * A view that represents a resistor
 */
var GrabBagResistorView = RectangularComponentView.extend({
    schematicImagePath:     undefined,
    schematicMaskImagePath: undefined,
    /**
     * Initializes the new GrabBagResistorView.
     */
    initialize: function(options) {
        this.imagePath     = this.model.get('grabBagItem').imagePath;
        this.maskImagePath = this.model.get('grabBagItem').imageMaskPath;

        if (this.model.get('length') > 1.6) {
            this.schematicImagePath     = Assets.Images.SCHEMATIC_LARGE_RESISTOR;
            this.schematicMaskImagePath = Assets.Images.SCHEMATIC_LARGE_RESISTOR_MASK;
        }
        else {
            this.schematicImagePath     = Assets.Images.SCHEMATIC_RESISTOR;
            this.schematicMaskImagePath = Assets.Images.SCHEMATIC_RESISTOR_MASK;
        }

        RectangularComponentView.prototype.initialize.apply(this, [options]);
    }

}, Constants.GrabBagResistorView);

export default GrabBagResistorView;
