import $ from 'jquery';
import _ from 'underscore';
import SimView from 'common/v3/app/sim';
import HelpLabelView from 'common/v3/help-label/index';
import RutherfordScatteringSimulation from 'rutherford-scattering/models/simulation';
import RutherfordScatteringSceneView from 'rutherford-scattering/views/scene';
import RutherfordScatteringLegendView from 'rutherford-scattering/views/legend';
import Constants from 'constants';
import 'nouislider';
import 'rutherford-scattering/styles/sim.less';
import 'rutherford-scattering/styles/playback-controls.less';
import 'common/styles/slider.less';
import 'common/styles/radio.less';
import simHtml from 'rutherford-scattering/templates/sim.html?raw';
import playbackControlsHtml from 'rutherford-scattering/templates/playback-controls.html?raw';

/**
 * This is the umbrella view for everything in a simulation tab.
 *   It will be extended by both the Intro module and the Charts
 *   and contains all the common functionality between the two.
 */
var RutherfordScatteringSimView = SimView.extend({

    /**
     * Root element properties
     */
    tagName:   'section',
    className: 'sim-view',

    /**
     * Template for rendering the basic scaffolding
     */
    template: _.template(simHtml),

    /**
     * Dom event listeners
     */
    events: {
        'click .play-btn'   : 'play',
        'click .pause-btn'  : 'pause',
        'click .step-btn'   : 'step',
        'click .reset-btn'  : 'reset',
        'click .help-btn'   : 'toggleHelp',

        'click .show-traces-check'  : 'toggleTraces',

        'slide .alpha-energy-slider'    : 'slideAlphaEnergy',
        'slide .protons-slider'   : 'slideProtons',
        'slide .neutrons-slider'  : 'slideNeutrons',

        'change .alpha-energy-slider'    : 'changeAlphaEnergy',
        'change .protons-slider'   : 'changeProtons',
        'change .neutrons-slider'  : 'changeNeutrons'
    },

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Rutherford Scattering',
            name: 'rutherford-scattering',
            link: 'rutherford-scattering'
        }, options);

        SimView.prototype.initialize.apply(this, [options]);

        this.initLegend();
        this.initSceneView();

        this.listenTo(this.simulation, 'change:paused', this.pausedChanged);
        this.pausedChanged(this.simulation, this.simulation.get('paused'));
    },

    /**
     * Initializes the Simulation.
     */
    initSimulation: function() {
        this.simulation = new RutherfordScatteringSimulation();
    },

    /**
     * Initializes the SceneView.
     */
    initSceneView: function() {
        this.sceneView = new RutherfordScatteringSceneView({
            simulation: this.simulation
        });
    },

    initLegend: function() {
        this.legendView = new RutherfordScatteringLegendView();
    },

    initControls: function() {
        this.controls = {};

        this.controls.energy = {
            $slider: this.$('.alpha-energy-slider'),
            min: Constants.MIN_ALPHA_ENERGY,
            max: Constants.MAX_ALPHA_ENERGY,
            initial: Constants.DEFAULT_ALPHA_ENERGY
        };
        this.controls.protons = {
            $slider: this.$('.protons-slider'),
            $value: this.$('.protons-value'),
            min: Constants.MIN_PROTON_COUNT,
            max: Constants.MAX_PROTON_COUNT,
            initial: Constants.DEFAULT_PROTON_COUNT
        };
        this.controls.neutrons = {
            $slider: this.$('.neutrons-slider'),
            $value: this.$('.neutrons-value'),
            min: Constants.MIN_NEUTRON_COUNT,
            max: Constants.MAX_NEUTRON_COUNT,
            initial: Constants.DEFAULT_NEUTRON_COUNT
        };
    },

    /**
     * Renders everything
     */
    render: function() {
        this.$el.empty();

        this.renderScaffolding();
        this.renderSceneView();
        this.renderPlaybackControls();

        this.initControls();
        this.renderControls();

        return this;
    },

    /**
     * Renders playback controls
     */
    renderPlaybackControls: function() {
        this.$el.append(playbackControlsHtml);
    },

    /**
     * Renders page content. Should be overriden by child classes
     */
    renderScaffolding: function() {
        var data = {
            Constants: Constants,
            simulation: this.simulation,
            showAtomProperties: this.showAtomProperties
        };
        this.$el.html(this.template(data));
        this.$('select');
    },

    /**
     * Renders the scene view
     */
    renderSceneView: function() {
        this.sceneView.render();
        this.$('.scene-view-placeholder').replaceWith(this.sceneView.el);
    },

    renderLegend: function() {
        this.legendView.render();
        this.$('.legend-panel').append(this.legendView.el);
    },

    renderControls: function() {
        _.each(this.controls, function(control, controlOf){
            control.$slider.noUiSlider({
                start: control.initial,
                range: {
                    min: control.min,
                    max: control.max
                },
                connect: 'lower'
            });
            if (control.$value) {
                control.$value.text(control.initial);
            }
        });
    },

    /**
     * Called after every component on the page has rendered to make sure
     *   things like widths and heights and offsets are correct.
     */
    postRender: function() {
        this.sceneView.postRender();

        this.renderLegend();
        this.renderHelp();
    },

    resetSimulation: function() {
        // Set pause the updater and reset everything
        this.updater.pause();
        this.updater.reset();
        this.resetComponents();
        this.rerender();

        // Resume normal function
        this.updater.play();
        this.play();
        this.pausedChanged();
    },

    /**
     * Resets all the components of the view.
     */
    resetComponents: function() {
        SimView.prototype.resetComponents.apply(this);
        this.sceneView.reset();
    },

    /**
     * This is run every tick of the updater.  It updates the wave
     *   simulation and the views.
     */
    update: function(time, deltaTime) {
        // Update the model
        this.simulation.update(time, deltaTime);

        var timeSeconds = time / 1000;
        var dtSeconds   = deltaTime / 1000;

        // Update the scene
        this.sceneView.update(timeSeconds, dtSeconds, this.simulation.get('paused'));
    },

    /**
     * The simulation changed its paused state.
     */
    pausedChanged: function() {
        if (this.simulation.get('paused'))
            this.$el.removeClass('playing');
        else
            this.$el.addClass('playing');
    },

    toggleTraces: function(event) {
        var trace = $(event.target).is(':checked');
        this.simulation.set('trace', trace);
    },

    slideAlphaEnergy: function(event) {
        // clear atoms
        this.simulation.pauseRayGun();
    },

    slideProtons: function(event) {
        var count = parseInt($(event.target).val());
        this.controls.protons.$value.text(count);
        this.simulation.set('protonCount', count);

        // clear atoms
        this.simulation.pauseRayGun();
    },

    slideNeutrons: function(event) {
        var count = parseInt($(event.target).val());
        this.controls.neutrons.$value.text(count);
        this.simulation.set('neutronCount', count);

        // clear atoms
        this.simulation.pauseRayGun();
    },

    changeAlphaEnergy: function(event) {
        var alphaEnergy = parseInt($(event.target).val());
        this.simulation.set('alphaEnergy', alphaEnergy);

        this.simulation.restartRayGun();
    },

    changeProtons: function(event) {
        var count = parseInt($(event.target).val());
        this.simulation.set('protonCount', count);

        this.simulation.restartRayGun();
    },

    changeNeutrons: function(event) {
        var count = parseInt($(event.target).val());
        this.simulation.set('neutronCount', count);

        this.simulation.restartRayGun();
    },

    renderHelp: function(){

        this.helpLabel = new HelpLabelView({
            attachTo : this.sceneView.rayGunView.rayGun,
            title : 'Turn on gun',
            orientation : 'bottom center',
            anchor: {
                x: 0.5,
                y: 0.5
            },
            color: '#FFF',
            font: 'bold 16pt Helvetica Neue'
        });

        this.helpLabel.render();
    },

    toggleHelp: function(event){

        $(event.currentTarget).toggleClass('active');

        this.helpLabel.toggle();
    }

});

export default RutherfordScatteringSimView;
