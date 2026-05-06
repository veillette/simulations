import ParticleGraphicsGenerator from 'views/particle-graphics-generator';
import SubatomicParticleView from 'views/subatomic-particle';

/**
 *
 */
var ElectronView = SubatomicParticleView.extend({

    createSprite: function() {
        return ParticleGraphicsGenerator.generateElectron(this.mvt);
    }

});


export default ElectronView;