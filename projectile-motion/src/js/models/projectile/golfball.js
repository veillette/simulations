import Projectile from 'models/projectile';

var Golfball = Projectile.extend({

    defaults: {
        mass:            0.046,
        diameter:        0.043,
        dragCoefficient: 0.24
    }

}, {
    getName: function() { return 'golfball'; }
});

export default Golfball;
