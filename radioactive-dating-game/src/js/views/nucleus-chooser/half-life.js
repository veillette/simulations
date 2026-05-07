import _ from 'underscore';
import AppView from 'common/v3/app/app';
import ModelViewTransform from 'common/math/model-view-transform';
import Vector2 from 'common/math/vector2';
import NucleusType from 'models/nucleus-type';
import Uranium238Nucleus from 'models/nucleus/uranium-238';
import Carbon14Nucleus from 'models/nucleus/carbon-14';
import HeavyAdjustableHalfLifeNucleus from 'models/nucleus/heavy-adjustable-half-life';
import NucleusChooser from 'views/nucleus-chooser';
import NucleusView from 'views/nucleus';


/**
 *
 */
var HalfLifeNucleusChooserView = NucleusChooser.extend({

    initialize: function(options) {
        options = _.extend({
            scale: AppView.windowIsShort() ? 16 : 18,
            spacingOffset: AppView.windowIsShort() ? -13 : 0
        }, options);

        NucleusChooser.prototype.initialize.apply(this, [options]);
    },

    /**
     * Creates the views and labels that will be used to render the list
     */
    initItems: function() {
        var items = [];
        var symbolSize = 30;

        // Carbon-14 to Nitrogen-14
        var carbon14   = Carbon14Nucleus.create();
        var nitrogen14 = Carbon14Nucleus.create();
        nitrogen14.decay(); // Decay from Carbon-14 into Nitrogen-14

        items.push({
            isDefault: true,
            nucleusType: NucleusType.CARBON_14,
            start: {
                label: 'Carbon-14',
                displayObject: new NucleusView({
                    model: carbon14,
                    mvt: this.mvt,
                    symbolSize: symbolSize,
                    hideNucleons: true
                }).displayObject
            },
            end: {
                label: 'Nitrogen-14',
                displayObject: new NucleusView({
                    model: nitrogen14,
                    mvt: this.mvt,
                    symbolSize: symbolSize,
                    hideNucleons: true
                }).displayObject
            }
        });

        var largeAtomMVT = new ModelViewTransform.createSinglePointScaleMapping(
            new Vector2(0, 0),
            new Vector2(0, 0),
            this.scale * 0.4
        );
        var largeAtomSymbolSize = 26;

        // Uranium-238 to Lead-206
        var uranium238 = Uranium238Nucleus.create();
        var lead206    = Uranium238Nucleus.create();
        lead206.decay(); // Uranium-238 to Lead-206

        items.push({
            nucleusType: NucleusType.URANIUM_238,
            start: {
                label: 'Uranium-238',
                displayObject: new NucleusView({
                    model: uranium238,
                    mvt: largeAtomMVT,
                    symbolSize: largeAtomSymbolSize,
                    hideNucleons: true
                }).displayObject
            },
            end: {
                label: 'Lead-206',
                displayObject: new NucleusView({
                    model: lead206,
                    mvt: largeAtomMVT,
                    symbolSize: largeAtomSymbolSize,
                    hideNucleons: true
                }).displayObject
            }
        });

        // Custom to custom decayed
        var custom  = HeavyAdjustableHalfLifeNucleus.create();
        var decayed = HeavyAdjustableHalfLifeNucleus.create();
        decayed.decay();

        items.push({
            nucleusType: NucleusType.HEAVY_CUSTOM,
            start: {
                label: 'Custom',
                displayObject: new NucleusView({
                    model: custom,
                    mvt: largeAtomMVT,
                    symbolSize: largeAtomSymbolSize,
                    hideNucleons: true
                }).displayObject
            },
            end: {
                label: 'Custom<br>(Decayed)',
                displayObject: new NucleusView({
                    model: decayed,
                    mvt: largeAtomMVT,
                    symbolSize: largeAtomSymbolSize,
                    hideNucleons: true
                }).displayObject
            }
        });

        this.items = items;
    }

});

export default HalfLifeNucleusChooserView;
