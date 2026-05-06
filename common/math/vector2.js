/**
 * Self-contained 2D vector class.  Previously delegated the base
 * implementation to the `vector2-node` npm package; that dependency has been
 * removed and the full implementation now lives here.
 */
define(function () {

    'use strict';

    /**
     * @param {number|Object} [x]  x component, or an object with .x/.y to copy.
     * @param {number}        [y]  y component (ignored when x is an object).
     */
    function Vector2(x, y) {
        if (x !== undefined && x !== null && typeof x === 'object') {
            this.x = x.x || 0;
            this.y = x.y || 0;
        } else {
            this.x = (x !== undefined) ? x : 0;
            this.y = (y !== undefined) ? y : 0;
        }
    }

    var p = Vector2.prototype;

    /** Set components in-place; also accepts a single Vector2 argument. */
    p.set = function (x, y) {
        if (typeof x === 'object' && x !== null) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
        return this;
    };

    /** Add another vector (or x,y) in-place. */
    p.add = function (x, y) {
        if (typeof x === 'object' && x !== null) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x || 0;
            this.y += y || 0;
        }
        return this;
    };

    /** Subtract another vector (or x,y) in-place. */
    p.subtract = function (x, y) {
        if (typeof x === 'object' && x !== null) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x || 0;
            this.y -= y || 0;
        }
        return this;
    };

    /** Alias for subtract. */
    p.sub = p.subtract;

    /** Scale both components by a scalar in-place. */
    p.scale = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };

    /** Rotate by angle (radians) in-place. */
    p.rotate = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var nx  = this.x * cos - this.y * sin;
        var ny  = this.x * sin + this.y * cos;
        this.x  = nx;
        this.y  = ny;
        return this;
    };

    /** Normalise to unit length in-place. */
    p.normalize = function () {
        var mag = this.magnitude();
        if (mag !== 0) {
            this.x /= mag;
            this.y /= mag;
        }
        return this;
    };

    /** Negate both components in-place. */
    p.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };

    /** Returns the Euclidean length of this vector. */
    p.magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    /** Alias for magnitude. */
    p.getMagnitude = p.magnitude;

    /** Alias for magnitude (matches the former vector2-node API). */
    p.length = p.magnitude;

    /** Returns squared Euclidean length (former vector2-node API). */
    p.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };

    /** Returns the angle of this vector in radians (atan2). */
    p.angle = function () {
        return Math.atan2(this.y, this.x);
    };

    /** Returns the dot product with another vector. */
    p.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };

    /** Returns the distance from this point to another (or to x,y). */
    p.distance = function (x, y) {
        var dx, dy;
        if (typeof x === 'object' && x !== null) {
            dx = this.x - x.x;
            dy = this.y - x.y;
        } else {
            dx = this.x - x;
            dy = this.y - y;
        }
        return Math.sqrt(dx * dx + dy * dy);
    };

    /** Returns the squared distance (avoids a sqrt). */
    p.distanceSq = function (x, y) {
        var dx, dy;
        if (typeof x === 'object' && x !== null) {
            dx = this.x - x.x;
            dy = this.y - x.y;
        } else {
            dx = this.x - x;
            dy = this.y - y;
        }
        return dx * dx + dy * dy;
    };

    /** Returns true when v has the same x and y (within optional epsilon). */
    p.equals = function (v, epsilon) {
        if (epsilon === undefined) {
            return this.x === v.x && this.y === v.y;
        }
        return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
    };

    /** Returns a new Vector2 with the same components. */
    p.clone = function () {
        return new Vector2(this.x, this.y);
    };

    /** Rounds each component to the nearest integer in-place. */
    p.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    };

    p.toString = function (precision) {
        if (precision === undefined) precision = 4;
        return '(' + this.x.toFixed(precision) + ', ' + this.y.toFixed(precision) + ')';
    };

    /** Static factory: unit vector in the direction of angle (radians). */
    Vector2.fromAngle = function (angle) {
        return new Vector2(1, 0).rotate(angle);
    };

    return Vector2;
});
