import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Constants from 'constants';
import WavelengthSliderView from 'common/controls/wavelength-slider';
import defineInputUpdateLocks from 'common/locks/define-locks';
import html from '../../templates/laser-controls.html?raw';
import 'styles/laser-controls.less';
Backbone.$ = $;

/**
 *
 */
var LaserControlsView = Backbone.View.extend({

    template: _.template(html),

    events: {
        'click .ray'    : 'rayClicked',
        'click .wave'   : 'waveClicked',
        'slide .slider' : 'changeWavelength'
    },

    initialize: function(options) {
        this.showWavelengthControls = options.showWavelengthControls;
        this.simulation = options.simulation;

        this.wavelengthSliderView = new WavelengthSliderView({
            defaultWavelength: this.model.get('wavelength') * 1E9, // Convert between SI and nanometers
            minWavelength: Constants.MIN_WAVELENGTH,
            maxWavelength: Constants.MAX_WAVELENGTH
        });
    },

    reset: function() {
        if (this.model.get('wave'))
            this.$('.wave').click();
        else
            this.$('.ray').click();

        this.updateLock(function() {
            this.wavelengthSliderView.reset();
            this.$value.text(parseInt(this.wavelengthSliderView.val()) + 'nm');
        });
    },

    /**
     * Renders content and canvas for heatmap
     */
    render: function() {
        var data = {
            showWavelengthControls: this.showWavelengthControls,
            unique: this.cid
        };

        this.setElement($(this.template(data)));

        this.wavelengthSliderView.render();
        this.$('.wavelength-slider-wrapper').append(this.wavelengthSliderView.el);

        this.$value = this.$('.wavelength-value');

        return this;
    },

    postRender: function() {
        this.wavelengthSliderView.postRender();
    },

    changeWavelength: function(event) {
        this.inputLock(function() {
            var wavelength = parseInt($(event.target).val());
            this.$value.text(wavelength + 'nm');
            this.simulation.set('wavelength', wavelength / Constants.METERS_TO_NANOMETERS);
        });
    },

    rayClicked: function(event) {
        this.model.set('wave', false);
    },

    waveClicked: function(event) {
        this.model.set('wave', true);
    }

});


// Add input/update locking functionality to the prototype
defineInputUpdateLocks(LaserControlsView);


export default LaserControlsView;
