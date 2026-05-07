import Bowlingball from 'models/projectile/bowlingball';
import ProjectileView from 'views/projectile';
import Assets from 'assets';

var BowlingballView = ProjectileView.extend({

    createProjectileSprite: function() {
        var sprite = Assets.createSprite(Assets.Images.BOWLINGBALL);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        return sprite;
    },

    createRestingProjectileSprite: function() {
        var sprite = Assets.createSprite(Assets.Images.BOWLINGBALL_IMPACT);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.4;
        return sprite;
    }

}, {
    getModelClass: function() {
        return Bowlingball;
    }
});

export default BowlingballView;