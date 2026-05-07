import Backbone from 'backbone';
import _ from 'underscore';
import VanillaCollection from 'common/collections/vanilla';

import Rectangle from 'common/math/rectangle';
import AlphaParticleModel from 'rutherford-scattering/models/alpha-particle';

var AlphaParticlesCollection = Backbone.Model.extend({
    model: AlphaParticleModel,

    initialize: function(attributes, options) {
        this._bounds = this.makeCullBounds(options.bounds);
        this.boundWidth = options.bounds.w;

        this.models = new VanillaCollection();
    },

    makeCullBounds: function(bounds){
        var boundTolerance = 10;
        var boundOffset = boundTolerance/2;
        var boundX = bounds.x - boundOffset;
        var boundY = bounds.y - boundOffset;
        var boundWidth = bounds.w + boundTolerance;
        var boundHeight = bounds.h + boundTolerance;

        return new Rectangle(boundX, boundY, boundWidth, boundHeight);
    },

    isParticleActive: function(particle){
        return !particle.get('remove') && this._bounds.contains(particle.getPosition());
    },

    cullParticles: function() {
        var inactiveParticles = this.models.reject(this.isParticleActive, this);
        _.each(inactiveParticles, _.partial(this.models.remove, _, {silent: true}), this.models);
        return this;
    },

    add: function(particle) {
        this.models.add(new this.model(particle), {silent: true});
    },

    reset: function() {
        this.models.reset([]);
        this.trigger('reset');
    },

    moveParticles: function(deltaTime, protonCount) {
        this.models.each(function(alphaParticle){
            alphaParticle.move(deltaTime, this.boundWidth, protonCount);
        }, this);
    }
});

export default AlphaParticlesCollection;
