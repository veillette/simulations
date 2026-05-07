import Baseball from 'models/projectile/baseball';
import ProjectileView from 'views/projectile';
import Assets from 'assets';

var BaseballView = ProjectileView.extend({

    createProjectileSprite: function() {
        var sprite = Assets.createSprite(Assets.Images.BASEBALL);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        return sprite;
    },

    createRestingProjectileSprite: function() {
        return this.createProjectileSprite();
    }

}, {
    getModelClass: function() {
        return Baseball;
    }
});

export default BaseballView;