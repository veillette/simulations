import _ from 'underscore';
import $ from 'jquery';
import NuclearPhysicsAppView from 'views/app';
import HalfLifeSimView from 'radioactive-dating-game/views/sim/half-life';
import DecayRatesSimView from 'radioactive-dating-game/views/sim/decay-rates';
import MeasurementSimView from 'radioactive-dating-game/views/sim/measurement';
import DatingGameSimView from 'radioactive-dating-game/views/sim/dating-game';
import Assets from 'assets';
import universalControlsHtml from 'radioactive-dating-game/templates/universal-controls.html?raw';
import 'radioactive-dating-game/styles/app.less';

var RadioactiveDatingGameAppView = NuclearPhysicsAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        HalfLifeSimView,
        DecayRatesSimView,
        MeasurementSimView,
        DatingGameSimView
    ],

    events: _.extend({}, NuclearPhysicsAppView.prototype.events, {
        'click .sound-btn' : 'changeVolume'
    }),

    /**
     * Override render function to add universal controls
     */
    render: function() {
        NuclearPhysicsAppView.prototype.render.apply(this);

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
                simView.setSoundVolumeLow();
            });
        }
        else if ($btn.hasClass('sound-btn-low')) {
            this.$('.sound-btn-high').show();
            _.each(this.simViews, function(simView) {
                simView.setSoundVolumeHigh();
            });
        }
        else if ($btn.hasClass('sound-btn-high')) {
            this.$('.sound-btn-mute').show();
            _.each(this.simViews, function(simView) {
                simView.setSoundVolumeMute();
            });
        }
    },

});

export default RadioactiveDatingGameAppView;
