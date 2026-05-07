import _ from 'underscore';
import $ from 'jquery';
import PixiAppView from 'common/v3/pixi/view/app';
import QuantumConfig from 'common/quantum/config';
import AtomicState from 'common/quantum/models/atomic-state';
import StimulatedPhoton from 'common/quantum/models/stimulated-photon';
import OneAtomSimView from 'views/sim/one-atom';
import MultipleAtomsSimView from 'views/sim/multiple-atoms';
import PhotonCollectionView from 'views/photon-collection';
import Assets from 'assets';
import 'styles/font-awesome.less';
import 'styles/app.less';
import settingsDialogHtml from 'templates/settings-dialog.html?raw';

/**
 * AppView for the Lasers simulation
 */
var LasersAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        OneAtomSimView,
        MultipleAtomsSimView
    ],

    events: _.extend({}, PixiAppView.prototype.events, {
        'click .help-btn' : 'toggleHelp',
        'slide .stimulation-probability-slider' : 'changeStimulationProbability',
        'slide .pair-separation-slider' : 'changePairSeparation',
        'slide .photon-diameter-slider' : 'changePhotonDiameter',
        'click .show-all-stimulated-emissions-check' : 'toggleShowAllStimulatedEmissions',
        'click .show-comets-check' : 'toggleShowComets'
    }),

    render: function() {
        PixiAppView.prototype.render.apply(this);

        this.$el.append(settingsDialogHtml);

        this.$stimulationProbabilityValue  = this.$('.stimulation-probability-value');
        this.$stimulationProbabilitySlider = this.$('.stimulation-probability-slider');
        this.$pairSeparationValue          = this.$('.pair-separation-value');
        this.$pairSeparationSlider         = this.$('.pair-separation-slider');
        this.$photonDiameterValue          = this.$('.photon-diameter-value');
        this.$photonDiameterSlider         = this.$('.photon-diameter-slider');

        this.$stimulationProbabilitySlider.noUiSlider({
            start: AtomicState.STIMULATION_LIKELIHOOD,
            range: {
                min: 0,
                max: 1
            },
            connect: 'lower'
        });

        this.$pairSeparationSlider.noUiSlider({
            start: StimulatedPhoton.separation,
            range: {
                min: 0,
                max: 100
            },
            connect: 'lower'
        });

        this.$photonDiameterSlider.noUiSlider({
            start: PhotonCollectionView.modelSize,
            range: {
                min: 8,
                max: 50
            },
            connect: 'lower'
        });

        this.updateStimulationProbabilityValue();
        this.updatePairSeparationValue();
        this.updatePhotonDiameterValue();
    },

    __TODO_settingSet: function(event) {
        _.each(this.simViews, function(simView) {

        });
    },

    updateStimulationProbabilityValue: function() {
        this.$stimulationProbabilityValue.text(AtomicState.STIMULATION_LIKELIHOOD.toFixed(2));
    },

    updatePairSeparationValue: function() {
        this.$pairSeparationValue.text(StimulatedPhoton.separation);
    },

    updatePhotonDiameterValue: function() {
        this.$photonDiameterValue.text(PhotonCollectionView.modelSize);
    },

    changeStimulationProbability: function(event) {
        var probability = parseFloat(this.$stimulationProbabilitySlider.val());
        AtomicState.STIMULATION_LIKELIHOOD = probability;
        this.updateStimulationProbabilityValue();
    },

    changePairSeparation: function(event) {
        var separation = parseInt(this.$pairSeparationSlider.val());
        StimulatedPhoton.separation = separation;
        this.updatePairSeparationValue();
    },

    changePhotonDiameter: function(event) {
        var diameter = parseInt(this.$photonDiameterSlider.val());
        PhotonCollectionView.modelSize = diameter;
        this.updatePhotonDiameterValue();
        _.each(this.simViews, function(simView) {
            simView.photonSizeChanged();
        });
    },

    toggleShowAllStimulatedEmissions: function() {
        if ($(event.target).is(':checked'))
            QuantumConfig.ENABLE_ALL_STIMULATED_EMISSIONS = true;
        else
            QuantumConfig.ENABLE_ALL_STIMULATED_EMISSIONS = false;
    },

    toggleShowComets: function() {
        if ($(event.target).is(':checked'))
            PhotonCollectionView.displayAsComets = true;
        else
            PhotonCollectionView.displayAsComets = false;
    },

    toggleHelp: function() {
        this.$('.help-btn').toggleClass('active');

        if (this.$('.help-btn').hasClass('active'))
            this.showHelp();
        else
            this.hideHelp();
    },

    showHelp: function() {
        for (var i = 0; i < this.simViews.length; i++)
            this.simViews[i].showHelp();
    },

    hideHelp: function() {
        for (var i = 0; i < this.simViews.length; i++)
            this.simViews[i].hideHelp();
    }

});

export default LasersAppView;
