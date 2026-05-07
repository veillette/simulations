import Golfball from 'models/projectile/golfball';
import ProjectileView from 'views/projectile';
import Assets from 'assets';

var GolfballView = ProjectileView.extend({

    createProjectileSprite: function() {
        var sprite = Assets.createSprite(Assets.Images.GOLFBALL);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        return sprite;
    },

    createRestingProjectileSprite: function() {
        return this.createProjectileSprite();
    }

}, {
    getModelClass: function() {
        return Golfball;
    }
});

export default GolfballView;