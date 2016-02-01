define(function (require) {

    'use strict';

    var HalfLifeInfo = require('models/half-life-info');

    var Constants = {}; 

    /*************************************************************************
     **                                                                     **
     **                         UNIVERSAL CONSTANTS                         **
     **                                                                     **
     *************************************************************************/

    Constants.FRAME_RATE = 25;
    Constants.DELTA_TIME_PER_FRAME = 5;

    //----------------------------------------------------------------------------
    // Paints and Colors
    //----------------------------------------------------------------------------
    
    // Color for the label used for the Polonium nucleus.
    Constants.POLONIUM_LABEL_COLOR = '#ff0';
    
    // Color for label used for the Lead nucleus.
    Constants.LEAD_LABEL_COLOR = '#000';
    
    // Color for label used for the Custom nucleus (pre-decay).
    Constants.CUSTOM_NUCLEUS_LABEL_COLOR = '#99ffff';
    
    // Color for label used for the Decayed Custom nucleus.
    Constants.CUSTOM_NUCLEUS_POST_DECAY_LABEL_COLOR = '#000';
    
    // Color for label used for the Hydrogen 3 nucleus.
    Constants.HYDROGEN_3_LABEL_COLOR = '#7FFF00';
    
    // Color for label used for the Helium 3 nucleus.
    Constants.HELIUM_3_LABEL_COLOR = '#FFC0CB';
    
    // Color for label used for the Carbon 14 nucleus.
    Constants.CARBON_14_LABEL_COLOR = '#ff0';
    
    // Color for label used for the Uranium 235 nucleus.
    Constants.NITROGEN_14_LABEL_COLOR = '#f80';
    
    // Color for label used for the Uranium 235 nucleus.
    Constants.URANIUM_235_LABEL_COLOR = '#0f0';
    
    // Color for label used for the Uranium 236 nucleus.
    Constants.URANIUM_236_LABEL_COLOR = '#f80';
    
    // Color for label used for the Uranium 238 nucleus.
    Constants.URANIUM_238_LABEL_COLOR = '#ff0';
    
    // Color for label used for the Uranium 239 nucleus.
    Constants.URANIUM_239_LABEL_COLOR = '#fff';
    
    // Color for hydrogen when represented as a circle or sphere.
    Constants.HYDROGEN_COLOR = '#FFC0DB';
    
    // Color for helium when represented as a circle or sphere.
    Constants.HELIUM_COLOR = '#0ff';
    
    // Color for carbon when represented as a circle or sphere.
    Constants.CARBON_COLOR = '#C80000';
    
    // Color for nitrogen when represented as a circle or sphere.
    Constants.NITROGEN_COLOR = '#0E56C8';
    
    // Color for Uranium when represented as a circle or sphere.
    Constants.URANIUM_COLOR = '#969600';
    
    // Color for Lead when represented as a circle or sphere.
    Constants.LEAD_COLOR = '#61757E';
    
    // Color for Polonium when represented as a circle or sphere.
    Constants.POLONIUM_COLOR = '#f80';
    
    // Color for pre-decay custom nucleus when represented as a circle or sphere.
    Constants.CUSTOM_NUCLEUS_PRE_DECAY_COLOR = '#9B612A';
    
    // Color for post-decay custom nucleus when represented as a circle or sphere.
    Constants.CUSTOM_NUCLEUS_POST_DECAY_COLOR = '#368237';
    
    // Color of the chart background for the alpha decay application.
    Constants.CHART_BACKGROUND_COLOR = '#F6F2AF';
    
    // Color of the reset button that appears on many of the canvases.
    Constants.CANVAS_RESET_BUTTON_COLOR = '#ff9900';
    
    // Colors for the strata in the Radioactive Dating Game, assumed to go
    // from top to bottom.
    // public static final ArrayList<Color> strataColors = new ArrayList<Color>();
    // static {
    //     strataColors.add( new Color( 111, 131, 151 ) );
    //     strataColors.add( new Color( 153, 185, 216 ) );
    //     strataColors.add( new Color( 216, 175, 208 ) );
    //     strataColors.add( new Color( 198, 218, 119 ) );
    //     strataColors.add( new Color( 179, 179, 179 ) );
    //     strataColors.add( Color.DARK_GRAY );
    // }

    //----------------------------------------------------------------------------
    // Misc Constants Shared within the Sim
    //----------------------------------------------------------------------------
    Constants.NUCLEON_DIAMETER        = 1.6; // In femtometers.
    Constants.ALPHA_PARTICLE_DIAMETER = 3.2; // In femtometers.
    Constants.ELECTRON_DIAMETER = 0.75; // In femtometers, not to scale, or even close.
    Constants.ANTINEUTRINO_DIAMETER = 0.3; // In femtometers, not to scale, or even close.

    Constants.PROTON_COLOR = '#f00';
    Constants.NEUTRON_COLOR = '#888';
    Constants.ELECTRON_COLOR = '#069EC7';
    Constants.ANTINEUTRINO_COLOR = '#00C800';
    
    Constants.DEFAULT_CUSTOM_NUCLEUS_HALF_LIFE = HalfLifeInfo.convertYearsToMs(100E3);



    /*************************************************************************
     **                                                                     **
     **                   MULTI-NUCLEUS DECAY SIMULATION                    **
     **                                                                     **
     *************************************************************************/

    var MultiNucleusDecaySimulation = {};

    MultiNucleusDecaySimulation.DEFAULT_JITTER_LENGTH = 1;
    MultiNucleusDecaySimulation.FRAMES_PER_JITTER = 2;

    Constants.MultiNucleusDecaySimulation = MultiNucleusDecaySimulation;


    /*************************************************************************
     **                                                                     **
     **                               NUCLEON                               **
     **                                                                     **
     *************************************************************************/

    var Nucleon = {};

    // Possible types of nucleons.  Not done as subclasses since they can
    //   change into one another.
    Nucleon.PROTON  = 1;
    Nucleon.NEUTRON = 2;

    // Distance used for jittering the nucleons.
    Nucleon.JITTER_DISTANCE = Constants.NUCLEON_DIAMETER * 0.1;

    Constants.Nucleon = Nucleon;


    /*************************************************************************
     **                                                                     **
     **                            ATOMIC NUCLEUS                           **
     **                                                                     **
     *************************************************************************/

    var AtomicNucleus = {};

    // Radius at which the repulsive electrical force overwhelms the strong
    // force.
    AtomicNucleus.DEFAULT_TUNNELING_REGION_RADIUS = 15;
    AtomicNucleus.MAX_TUNNELING_REGION_RADIUS = 200;

    Constants.AtomicNucleus = AtomicNucleus;


    /*************************************************************************
     **                                                                     **
     **                       COMPOSITE ATOMIC NUCLEUS                      **
     **                                                                     **
     *************************************************************************/

    var CompositeAtomicNucleus = {};

    // Default value for agitation.
    CompositeAtomicNucleus.DEFAULT_AGITATION_FACTOR = 5;
    // Maximum value for agitation.
    CompositeAtomicNucleus.MAX_AGITATION_FACTOR = 9;

    Constants.CompositeAtomicNucleus = CompositeAtomicNucleus;


    /*************************************************************************
     **                                                                     **
     **                     BETA DECAY COMPOSITE NUCLEUS                    **
     **                                                                     **
     *************************************************************************/

    var BetaDecayCompositeNucleus = {};

    BetaDecayCompositeNucleus.ANTINEUTRINO_EMISSION_SPEED = 0.8; // Femtometers per clock tick.  Weird, I know.
    BetaDecayCompositeNucleus.ELECTRON_EMISSION_SPEED     = 0.4; // Femtometers per clock tick.  Weird, I know.

    Constants.BetaDecayCompositeNucleus = BetaDecayCompositeNucleus;


    /*************************************************************************
     **                                                                     **
     **                     ABSTRACT BETA DECAY NUCLEUS                     **
     **                                                                     **
     *************************************************************************/

    var AbstractBetaDecayNucleus = {};

    AbstractBetaDecayNucleus.ANTINEUTRINO_EMISSION_SPEED = 1.5; // Femtometers per clock tick.  Weird, I know.
    AbstractBetaDecayNucleus.ELECTRON_EMISSION_SPEED     = 0.8; // Femtometers per clock tick.  Weird, I know.

    Constants.AbstractBetaDecayNucleus = AbstractBetaDecayNucleus;


    /*************************************************************************
     **                                                                     **
     **                  HEAVY ADJUSTABLE-HALF-LIFE NUCLEUS                 **
     **                                                                     **
     *************************************************************************/

    var HeavyAdjustableHalfLifeNucleus = {};

    // Number of neutrons and protons in the nucleus upon construction.  The
    // values below are for Bismuth 208.
    HeavyAdjustableHalfLifeNucleus.ORIGINAL_NUM_PROTONS = 83;
    HeavyAdjustableHalfLifeNucleus.ORIGINAL_NUM_NEUTRONS = 125;

    // Random number generator used for calculating decay time based on half life.
    HeavyAdjustableHalfLifeNucleus.DEFAULT_HALF_LIFE = 1100;  // In milliseconds.

    Constants.HeavyAdjustableHalfLifeNucleus = HeavyAdjustableHalfLifeNucleus;


    /*************************************************************************
     **                                                                     **
     **                         POLONIUM 211 NUCLEUS                        **
     **                                                                     **
     *************************************************************************/

    var Polonium211Nucleus = {};

    // Number of neutrons and protons in the nucleus upon construction.  The
    // values below are for Bismuth 208.
    Polonium211Nucleus.ORIGINAL_NUM_PROTONS = 84;
    Polonium211Nucleus.ORIGINAL_NUM_NEUTRONS = 127;

    // Random number generator used for calculating decay time based on half life.
    Polonium211Nucleus.HALF_LIFE = 516;  // In milliseconds.

    Constants.Polonium211Nucleus = Polonium211Nucleus;


    /*************************************************************************
     **                                                                     **
     **                          CARBON 14 NUCLEUS                          **
     **                                                                     **
     *************************************************************************/

    var Carbon14Nucleus = {};

    // Number of neutrons and protons in the nucleus upon construction.
    Carbon14Nucleus.PROTONS  = 6;
    Carbon14Nucleus.NEUTRONS = 8;

    // Half life for Carbon 14.
    Carbon14Nucleus.HALF_LIFE = HalfLifeInfo.getHalfLifeForNucleusType(NucleusType.CARBON_14);

    // Time scaling factor - scales the rate at which decay occurs so that we
    //   don't really have to wait around thousands of years.  Smaller values
    //   cause quicker decay.
    Carbon14Nucleus.DECAY_TIME_SCALING_FACTOR = 1500 / Carbon14Nucleus.HALF_LIFE;

    Constants.Carbon14Nucleus = Carbon14Nucleus;


    /*************************************************************************
     **                                                                     **
     **                         HYDROGEN 3 NUCLEUS                          **
     **                                                                     **
     *************************************************************************/

    var Hydrogen3Nucleus = {};

    // Number of neutrons and protons in the nucleus upon construction.
    Hydrogen3Nucleus.PROTONS  = 1;
    Hydrogen3Nucleus.NEUTRONS = 2;

    // Time scaling factor - scales the rate at which decay occurs so that we
    //   don't really have to wait around thousands of years.  Smaller values
    //   cause quicker decay.
    Hydrogen3Nucleus.DECAY_TIME_SCALING_FACTOR = 1500 / HalfLifeInfo.getHalfLifeForNucleusType(NucleusType.HYDROGEN_3);

    Constants.Hydrogen3Nucleus = Hydrogen3Nucleus;


    /*************************************************************************
     **                                                                     **
     **                 LIGHT ADJUSTABLE-HALF-LIFE NUCLEUS                  **
     **                                                                     **
     *************************************************************************/

    var LightAdjustableHalfLifeNucleus = {};

    // Number of neutrons and protons in the nucleus upon construction.
    LightAdjustableHalfLifeNucleus.PROTONS  = 8;
    LightAdjustableHalfLifeNucleus.NEUTRONS = 8;

    // Time scaling factor - scales the rate at which decay occurs so that we
    //   don't really have to wait around thousands of years.  Smaller values
    //   cause quicker decay.
    LightAdjustableHalfLifeNucleus.DECAY_TIME_SCALING_FACTOR = 1500 / HalfLifeInfo.getHalfLifeForNucleusType(NucleusType.LIGHT_CUSTOM);

    Constants.LightAdjustableHalfLifeNucleus = LightAdjustableHalfLifeNucleus;


    return Constants;
});
