import AdultHuman from 'models/projectile/adult-human';
import ProjectileView from 'views/projectile';
import Assets from 'assets';

var AdultHumanView = ProjectileView.extend({

    createProjectileSprite: function() {
        var sprite = Assets.createSprite(Assets.Images.HUMAN);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        return sprite;
    },

    createRestingProjectileSprite: function() {
        var sprite = Assets.createSprite(Assets.Images.HUMAN_IMPACT);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        return sprite;
    },

    calculateScale: function() {
        var targetSpriteWidth = this.mvt.modelToViewDeltaX(this.model.get('diameter')); // in pixels
        targetSpriteWidth *= 2;
        return targetSpriteWidth / this.projectileSprite.width;
    }

}, {
    getModelClass: function() {
        return AdultHuman;
    }
});

export default AdultHumanView;