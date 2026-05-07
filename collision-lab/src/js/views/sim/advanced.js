import _ from 'underscore';
import CollisionLabSimView from 'views/sim';
import ballSettingsHtml from 'templates/ball-settings-2d.html?raw';
import advancedCheckboxesHtml from 'templates/advanced-checkboxes.html?raw';

/**
 * Advanced tab
 */
var AdvancedSimView = CollisionLabSimView.extend({

    ballSettingsHtml: ballSettingsHtml,
    advancedCheckboxesTemplate: _.template(advancedCheckboxesHtml),

    /**
     * Inits simulation, views, and variables.
     *
     * @params options
     */
    initialize: function(options) {
        options = _.extend({
            title: 'Advanced',
            name: 'advanced-sim',
        }, options);

        CollisionLabSimView.prototype.initialize.apply(this, [options]);
    },

    /**
     * Renders playback and sim controls
     */
    renderControls: function() {
        CollisionLabSimView.prototype.renderControls.apply(this);

        var data = {
            name: this.name
        };

        this.$('.visibility-controls').append(this.advancedCheckboxesTemplate(data));
    },

});

export default AdvancedSimView;
