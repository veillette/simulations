import Projectile from 'models/projectile';

var Piano = Projectile.extend({

    defaults: {
        mass:          400,
        diameter:        2,
        dragCoefficient: 1.2
    }

}, {
    getName: function() { return 'piano'; }
});

export default Piano;
