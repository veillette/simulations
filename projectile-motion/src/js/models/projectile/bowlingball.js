import Projectile from 'models/projectile';

var Bowlingball = Projectile.extend({

    defaults: {
        mass:            7.3,
        diameter:        0.25,
        dragCoefficient: 0.46
    }

}, {
    getName: function() { return 'bowlingball'; }
});

export default Bowlingball;
