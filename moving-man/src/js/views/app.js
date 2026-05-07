import _ from 'underscore';
import AppView from 'common/app/app';
import IntroSimView from 'views/sim/intro';
import ChartsSimView from 'views/sim/charts';
import 'styles/font-awesome.css';
import 'styles/app.css';
import universalControlsHtml from 'templates/universal-controls.html?raw';

var MovingManAppView = AppView.extend({

    simViewConstructors: [
        IntroSimView,
        ChartsSimView
    ],

    events: _.extend({}, AppView.prototype.events, {
        'click .sound-btn' : 'changeVolume'
    }),

    /**
     * Override render function to add universal controls
     */
    render: function() {
        AppView.prototype.render.apply(this);

        this.$el.append(universalControlsHtml);
    },

    /**
     * Steps between the different discrete volume values and updates
     *   the button's icon.
     */
    changeVolume: function(event) {
        var $btn = $(event.target).closest('.sound-btn');

        $btn.hide();

        if ($btn.hasClass('sound-btn-mute')) {
            this.$('.sound-btn-low').show();
            _.each(this.simViews, function(simView) {
                simView.sceneView.movingManView.lowVolume();
            });
        }
        else if ($btn.hasClass('sound-btn-low')) {
            this.$('.sound-btn-high').show();
            _.each(this.simViews, function(simView) {
                simView.sceneView.movingManView.highVolume();
            });
        }
        else if ($btn.hasClass('sound-btn-high')) {
            this.$('.sound-btn-mute').show();
            _.each(this.simViews, function(simView) {
                simView.sceneView.movingManView.muteVolume();
            });
        }
    },

});

export default MovingManAppView;
