import RutherfordParticle from 'rutherford-scattering/models/rutherford-particle';
import AlphaParticles from 'rutherford-scattering/collections/alpha-particles';

var RutherfordParticles = AlphaParticles.extend({
    model: RutherfordParticle
});

export default RutherfordParticles;
