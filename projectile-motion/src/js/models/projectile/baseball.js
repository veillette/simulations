import Projectile from 'models/projectile';

var Baseball = Projectile.extend({

    defaults: {
        mass:            0.145,
        diameter:        0.074,
        dragCoefficient: 0.4
    }

}, {
    getName: function() { return 'baseball'; }
});

export default Baseball;
