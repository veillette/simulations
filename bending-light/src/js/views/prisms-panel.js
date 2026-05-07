import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import MediumControlsView from 'views/medium-controls';
import defineInputUpdateLocks from 'common/locks/define-locks';
import html from '../../templates/prisms-panel.html?raw';
import 'styles/prisms-panel.less';
Backbone.$ = $;

/**
 *
 */
var PrismsPanelView = Backbone.View.extend({

    template: _.template(html),

    events: {
        'click .prism-icon' : 'iconClicked'
    },

    initialize: function(options) {
        this.prismImages = options.prismImages;
        this.simulation = options.simulation;

        this.initMediumControls();
    },

    initMediumControls: function() {
        this.mediumControlsView = new MediumControlsView({
            model: this.simulation.prismMedium,
            simulation: this.simulation,
            name: 'prisms',
            label: 'Objects'
        });
    },

    /**
     * Renders content and canvas for heatmap
     */
    render: function() {
        var data = {
            prismImages: this.prismImages
        };

        this.setElement($(this.template(data)));

        this.mediumControlsView.render();
        this.mediumControlsView.$el.removeClass('control-panel');

        this.$('.medium-controls-wrapper').append(this.mediumControlsView.el);

        return this;
    },

    iconClicked: function(event) {
        var index = $(event.target).data('index');
        var prism = this.simulation.createPrismFromPrototype(index);
        this.simulation.addPrism(prism);
    }

});


// Add input/update locking functionality to the prototype
defineInputUpdateLocks(PrismsPanelView);


export default PrismsPanelView;
