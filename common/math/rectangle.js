import './polyfills';
import Vector2 from './vector2';
import lineIntersect from './line-intersection';

function Rectangle(x, y, w, h) {
    this._centerVector   = new Vector2();
    this._positionVector = new Vector2();
    this._sizeVector     = new Vector2();
    if (x instanceof Rectangle) {
        this.x = x.x;
        this.y = x.y;
        this.w = x.w;
        this.h = x.h;
    } else {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
    }
}

Rectangle.prototype.set = function (x, y, w, h) {
    if (x instanceof Rectangle) {
        this.x = x.x;
        this.y = x.y;
        this.w = x.w;
        this.h = x.h;
    } else {
        this.x = (x !== undefined) ? x : 0;
        this.y = (y !== undefined) ? y : 0;
        this.w = (w !== undefined) ? w : 0;
        this.h = (h !== undefined) ? h : 0;
    }
    return this;
};

Rectangle.prototype.clone = function () {
    return new Rectangle(this);
};

Rectangle.prototype.left   = function () { return this.x; };
Rectangle.prototype.right  = function () { return this.x + this.w; };
Rectangle.prototype.bottom = function () { return this.y; };
Rectangle.prototype.top    = function () { return this.y + this.h; };

/** Getter (no args) returns a cached Vector2; setter (x,y) updates x,y. */
Rectangle.prototype.position = function (x, y) {
    if (x === undefined)
        return this._positionVector.set(this.x, this.y);
    this.x = x;
    this.y = y;
    return this;
};

/** Getter (no args) returns a cached Vector2; setter (w,h) updates w,h. */
Rectangle.prototype.size = function (w, h) {
    if (w === undefined)
        return this._sizeVector.set(this.w, this.h);
    this.w = w;
    this.h = h;
    return this;
};

/**
 * Returns a rectangle that is the intersection of this and another
 * rectangle.  Algorithm from java.awt.geom.Rectangle2D.intersect.
 */
Rectangle.prototype.intersection = function (that) {
    if (this._intersectionRect === undefined)
        this._intersectionRect = new Rectangle();

    var x1 = Math.max(this.left(),   that.left());
    var y1 = Math.max(this.bottom(), that.bottom());
    var x2 = Math.min(this.right(),  that.right());
    var y2 = Math.min(this.top(),    that.top());

    return this._intersectionRect.set(x1, y1, x2 - x1, y2 - y1);
};

/**
 * Returns an array of points (Vector2) where the given line segment
 * intersects the perimeter of this rectangle.
 */
Rectangle.prototype.lineIntersectionPoints = function (x0, y0, x1, y1) {
    if (x0 instanceof Vector2) {
        if (y0 instanceof Vector2) {
            y1 = y0.y;
            x1 = y0.x;
            y0 = x0.y;
            x0 = x0.x;
        } else {
            throw 'Rectangle.lineIntersectionPoints: Cannot mix object and flat params.';
        }
    }

    var ln = [
        [ this.left(),  this.bottom(), this.left(),  this.top()    ],
        [ this.left(),  this.top(),    this.right(), this.top()    ],
        [ this.right(), this.top(),    this.right(), this.bottom() ],
        [ this.right(), this.bottom(), this.left(),  this.bottom() ]
    ];

    var intersections = [];
    for (var i = 0; i < ln.length; i++) {
        var pt = lineIntersect.lineIntersection(x0, y0, x1, y1, ln[i][0], ln[i][1], ln[i][2], ln[i][3]);
        if (pt instanceof Vector2)
            intersections.push(pt.clone());
    }

    return intersections;
};

Rectangle.prototype.contains = function (x, y) {
    if (x instanceof Rectangle)
        return this.contains(x.position()) && this.contains(x.position().add(x.size()));
    if (x instanceof Vector2)
        return this.left() <= x.x && x.x <= this.right() &&
               this.bottom() <= x.y && x.y <= this.top();
    return this.left() <= x && x <= this.right() &&
           this.bottom() <= y && y <= this.top();
};

/** Allows Rectangle to be used interchangeably with PiecewiseCurve. */
Rectangle.prototype.getBounds = function () {
    return this;
};

Rectangle.prototype.center = function (x, y) {
    if (x instanceof Vector2)
        return this.position(x.x - this.w / 2, x.y - this.h / 2);
    else if (x !== undefined)
        return this.position(x - this.w / 2, y - this.h / 2);
    return this._centerVector.set(this.x + this.w / 2, this.y + this.h / 2);
};

/**
 * Translates this rectangle by the provided delta and returns itself.
 * Supports (dx, dy) or a Vector2-like argument.
 */
Rectangle.prototype.translate = function (dx, dy) {
    if (dx instanceof Vector2) {
        this.x += dx.x;
        this.y += dx.y;
    } else {
        this.x += dx || 0;
        this.y += dy || 0;
    }
    return this;
};

/** Returns whether this rectangle overlaps another rectangle (AABB test). */
Rectangle.prototype.overlaps = function (that) {
    return this.left()   < that.right()  &&
           this.right()  > that.left()   &&
           this.bottom() < that.top()    &&
           this.top()    > that.bottom();
};

/**
 * Returns whether the rectangle overlaps a circle.
 * Algorithm: http://stackoverflow.com/a/402010/4085004
 */
Rectangle.prototype.overlapsCircle = function (x, y, radius) {
    var distanceX = Math.abs(x - (this.x + this.w / 2));
    var distanceY = Math.abs(y - (this.y + this.h / 2));

    if (distanceX > (this.w / 2 + radius)) return false;
    if (distanceY > (this.h / 2 + radius)) return false;

    if (distanceX <= (this.w / 2)) return true;
    if (distanceY <= (this.h / 2)) return true;

    var cornerDistSq =
        Math.pow(distanceX - this.w / 2, 2) +
        Math.pow(distanceY - this.h / 2, 2);

    return cornerDistSq <= radius * radius;
};

/**
 * Returns whether the rectangle overlaps an axis-aligned ellipse defined
 * by its centre (x,y) and semi-axes a (x) and b (y).
 */
Rectangle.prototype.overlapsEllipse = function (x, y, a, b) {
    if (!this._transformedRect)
        this._transformedRect = new Rectangle();

    var r = this._transformedRect.set(this.x, this.y, this.w, this.h);
    r.x -= x;  r.x /= a;  r.w /= a;
    r.y -= y;  r.y /= b;  r.h /= b;

    return r.overlapsCircle(0, 0, 1);
};

Rectangle.prototype.toString = function (precision) {
    if (precision === undefined) precision = 4;
    return '(' + this.x.toFixed(precision) + ', ' + this.y.toFixed(precision) + ') '
               + this.w.toFixed(precision) + 'x' + this.h.toFixed(precision);
};

export default Rectangle;
