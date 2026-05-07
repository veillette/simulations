import _ from 'underscore';
import Vector2 from 'common/math/vector2';
import Law from 'models/law';

/**
 *
 */
var Turnstile = function(center, angleVelocityScale) {
    this.center = new Vector2(center);
    this.angleVelocityScale = angleVelocityScale;
    this.angle = 0;
    this.angularSpeed = 0.31;
};

/**
 * Instance functions/properties
 */
_.extend(Turnstile.prototype, Law.prototype, {

    update: function(deltaTime, system) {
        this.angle = this.angularSpeed * deltaTime + this.angle;
    },

    currentChanged: function(a) {
        this.angularSpeed = a * this.angleVelocityScale;
    }

});

export default Turnstile;
