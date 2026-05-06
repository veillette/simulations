import ParticleGraphicsGenerator from 'views/particle-graphics-generator';
import SubatomicParticleView from 'views/subatomic-particle';

/**
 *
 */
var AntineutrinoView = SubatomicParticleView.extend({

    createSprite: function() {
        return ParticleGraphicsGenerator.generateAntineutrino(this.mvt);
    }

});


export default AntineutrinoView;