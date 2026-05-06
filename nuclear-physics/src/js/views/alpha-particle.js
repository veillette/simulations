import ParticleGraphicsGenerator from 'views/particle-graphics-generator';
import SubatomicParticleView from 'views/subatomic-particle';

/**
 *
 */
var AlphaParticleView = SubatomicParticleView.extend({

    createSprite: function() {
        return ParticleGraphicsGenerator.generateAlphaParticle(this.mvt);
    }

});


export default AlphaParticleView;