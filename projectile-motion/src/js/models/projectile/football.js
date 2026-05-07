import Projectile from 'models/projectile';

var Football = Projectile.extend({

    defaults: {
        mass:            0.41,
        diameter:        0.17,
        dragCoefficient: 0.15
    }

}, {
    getName: function() { return 'football'; }
});

export default Football;
