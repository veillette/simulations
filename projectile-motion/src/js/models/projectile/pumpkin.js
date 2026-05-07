import Projectile from 'models/projectile';

var Pumpkin = Projectile.extend({

    defaults: {
        mass:            5,
        diameter:        0.37,
        dragCoefficient: 0.6
    }

}, {
    getName: function() { return 'pumpkin'; }
});

export default Pumpkin;
