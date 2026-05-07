import Projectile from 'models/projectile';

var TankShell = Projectile.extend({

    defaults: {
        mass:           150,
        diameter:         0.15,
        dragCoefficient:  0.05
    }

}, {
    getName: function() { return 'tank shell'; }
});

export default TankShell;
