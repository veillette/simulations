define(function (require) {

    'use strict';

    var _              = require('underscore');
    var solveQuadratic = require('../node_modules/solve-quadratic-equation-shimmed/index');
    var solveCubic     = require('./solve-cubic-equation');
    var lineIntersect  = require('./line-intersection');
    var Rectangle      = require('./rectangle');
    var Vector2        = require('./vector2');

    /**
     * The purpose of this class is to store paths of points and wathis.yPoints in
     *   the case of curved connections.  This is not a piecewise linear curve
     *   because each connection between two points can have one of several
     *   this.types of algorithms (linear, quadratic, and cubic). 
     *
     * This class is modeled after Java AWT's GeneralPath and includes sections of
     *   almost verbatim code.  Java.awt.geom.GeneralPath is distributed under the
     *   GNU General Public License.
     */
    var PiecewiseCurve = function() {
        this.types   = [];
        this.xPoints = [];
        this.yPoints = [];

        this.index    = 0; // The index of the next point to be created
        this.subcurve = 0; // The index of the last moveTo point

        // Cached translation matrix array
        this._translation = [
            1, 0, 0,
            0, 1, 0
        ];

        // Cached rotation matrix array
        this._rotation = [
            1, 0, 0,
            0, 1, 0
        ];

        // Cached scale matrix array
        this._scale = [
            1, 0, 0,
            0, 1, 0
        ];

        // Cached bounds rectangle
        this._bounds = new Rectangle();
        this._point  = new Vector2();
    };

    /**
     * Constants
     */
    PiecewiseCurve.SEG_MOVETO  = 0;
    PiecewiseCurve.SEG_LINETO  = 1;
    PiecewiseCurve.SEG_QUADTO  = 2;
    PiecewiseCurve.SEG_CUBICTO = 3;
    PiecewiseCurve.SEG_CLOSE   = 4;

    // Java docs: "A big number, but not so big it can't survive a few float operations"
    PiecewiseCurve.BIG_VALUE = Number.MAX_VALUE / 1000;

    /**
     * Static Functions
     */
    _.extend(PiecewiseCurve, {

        fromPoints: function(points, closeSubcurve) {
            var curve = new PiecewiseCurve();
            curve.addPoints(points, closeSubcurve);
            return curve;
        },

        fromPointArrays: function(pointArrays) {
            var curve = new PiecewiseCurve();
            for (var i = 0; i < pointArrays.length; i++)
                curve.addPoints(pointArrays[i]);
            return curve;
        },

        createEllipse: function(x, y, w, h) {
            return new PiecewiseCurve()
                .moveTo(x, y + h / 2)
                .curveTo(x, y + h, x + w, y + h, x + w, y + h / 2)
                .curveTo(x + w, y, x, y, x, y + h / 2)
                .close();
        }

    });

    /**
     * Instance Functions
     */
    _.extend(PiecewiseCurve.prototype, {

        clone: function() {
            var clone = new PiecewiseCurve();
            clone.index = this.index;
            clone.subcurve = this.subcurve;
            clone.types = _.clone(this.types);
            clone.yPoints = _.clone(this.yPoints);
            clone.xPoints = _.clone(this.xPoints);
            clone._translation = _.clone(this._translation);
            clone._rotation = _.clone(this._rotation);
            clone._scale = _.clone(this._scale);
            clone._bounds = new Rectangle();
            return clone;
        },

        size: function() {
            return this.index;
        },

        addPoints: function(points, closeSubcurve) {
            if (points.length === 0)
                return;

            this.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++)
                this.lineTo(points[i].x, points[i].y);

            if (closeSubcurve || closeSubcurve === undefined)
                this.close();
        },

        /**
         * Simply appends another curve to this one. Note that
         *   this is not the same as a union operation.
         */
        add: function(otherCurve, returnNew) {
            var curve = this;
            if (returnNew) {
                curve = new PiecewiseCurve();
                curve.add(this);
            }

            // The current subcurve index is whatever the subcurve
            //   index of the other curve was but offset by the
            //   length of this one (before adding the other curve)
            curve.subcurve = curve.index + otherCurve.subcurve;

            // Copy all the information stored in arrays
            for (var t = 0; t < otherCurve.types.length; t++) {
                curve.types.push(otherCurve.types[t]);
            }
            for (var i = 0; i < otherCurve.xPoints.length; i++) {
                curve.xPoints.push(otherCurve.xPoints[i]);
                curve.yPoints.push(otherCurve.yPoints[i]);
            }

            curve.index += otherCurve.index;

            return curve;
        },

        /**
         * This deviates from the GeneralPath code in that our
         *   transformMatrix goes down the rows instead of the
         *   columns because that seems to be the more popular
         *   way of flattening a 3x3 matrix.  (If cells are
         *   normally referenced like m[r][c], it would be
         *   flattened by any sane algorithm to go down the
         *   rows.)
         */
        transform: function(transformMatrix) {
            var newX;
            var newY;
            var tm = transformMatrix;
            var xPoints = this.xPoints;
            var yPoints = this.yPoints;
            for (var i = 0; i < this.index; i++) {
                newX = tm[0] * xPoints[i] + tm[1] * yPoints[i] + tm[2];
                newY = tm[3] * xPoints[i] + tm[4] * yPoints[i] + tm[5];
                xPoints[i] = newX;
                yPoints[i] = newY;
            }
            return this;
        },

        /**
         * Creates a 2D translation matrix and calls transform.
         */
        translate: function(dx, dy) {
            if (dx instanceof Vector2) {
                dy = dx.y;
                dx = dx.x;
            }
            this._translation[2] = dx;
            this._translation[5] = dy;
            this.transform(this._translation);
            return this;
        },

        /**
         * Creates a 2D rotation matrix and calls transform.
         */
        rotate: function(theta) {
            var cos = Math.cos(theta);
            var sin = Math.sin(theta);
            this._rotation[0] = cos;
            this._rotation[1] = -sin;
            this._rotation[3] = sin;
            this._rotation[4] = cos;
            this.transform(this._rotation);
            return this;
        },

        scale: function(x, y) {
            this._scale[0] = x;
            this._scale[4] = y !== undefined ? y : x;
            this.transform(this._scale);
            return this;
        },

        length: function() {
            return this.index;
        },

        at: function(index) {
            return this._point.set(
                this.xPoints[index],
                this.yPoints[index]
            );
        },

        /**
         * Returns a rectangle representing a minimal bounding box.
         */
        getBounds: function() {
            var xPoints = this.xPoints;
            var yPoints = this.yPoints;

            var minX;
            var minY;
            var maxX;
            var maxY;

            if (this.index > 0) {
                minX = maxX = xPoints[0];
                minY = maxY = yPoints[0];
            }
            else {
                minX = maxX = minY = maxY = 0;
            }

            for (var i = 0; i < this.index; i++) {
                minX = Math.min(xPoints[i], minX);
                minY = Math.min(yPoints[i], minY);
                maxX = Math.max(xPoints[i], maxX);
                maxY = Math.max(yPoints[i], maxY);
            }

            return this._bounds.set(
                minX,
                minY,
                maxX - minX,
                maxY - minY
            );
        },

        /**
         * Adds a new point to a path.
         * 
         * @param x  the x-coordinate.
         * @param y  the y-coordinate.
         */
        moveTo: function(x, y) {
            if (x instanceof Vector2) {
                y = x.y;
                x = x.x;
            }
            this.subcurve = this.index;
            this.types[this.index] = PiecewiseCurve.SEG_MOVETO;
            this.xPoints[this.index]   = x;
            this.yPoints[this.index++] = y;
            return this;
        },

        /**
         * Adds a new point to a path.
         * 
         * @param dx  the relative x-coordinate.
         * @param dy  the relative y-coordinate.
         */
        moveToRelative: function(dx, dy) {
            if (dx instanceof Vector2) {
                dy = dx.y;
                dx = dx.x;
            }
            
            var lastX = 0;
            var lastY = 0;
            if (this.index > 0) {
                lastX = this.xPoints[this.index - 1];
                lastY = this.yPoints[this.index - 1];
            }

            return this.moveTo(lastX + dx, lastY + dy);
        },
        
        /**
         * Appends a straight line to the current path.
         *
         * @param x x coordinate of the line endpoint.
         * @param y y coordinate of the line endpoint.
         */
        lineTo: function(x, y) {
            if (x instanceof Vector2) {
                y = x.y;
                x = x.x;
            }
            this.types[this.index] = PiecewiseCurve.SEG_LINETO;
            this.xPoints[this.index]   = x;
            this.yPoints[this.index++] = y;
            return this;
        },

        /**
         * Appends a straight line to the current path.
         * 
         * @param dx  the relative x-coordinate.
         * @param dy  the relative y-coordinate.
         */
        lineToRelative: function(dx, dy) {
            if (dx instanceof Vector2) {
                dy = dx.y;
                dx = dx.x;
            }

            var lastX = 0;
            var lastY = 0;
            if (this.index > 0) {
                lastX = this.xPoints[this.index - 1];
                lastY = this.yPoints[this.index - 1];
            }

            return this.lineTo(lastX + dx, lastY + dy);
        },
        
        /**
         * Appends a quadratic Bezier curve to the current path.
         *
         * @param x1 x coordinate of the control point
         * @param y1 y coordinate of the control point
         * @param x2 x coordinate of the curve endpoint.
         * @param y2 y coordinate of the curve endpoint.
         */
        quadTo: function(x1, y1, x2, y2) {
            if (x1 instanceof Vector2) {
                y2 = y1.y;
                x2 = y1.x;
                y1 = x1.y;
                x1 = x1.x;
            }
            this.types[this.index] = PiecewiseCurve.SEG_QUADTO;
            this.xPoints[this.index]   = x1;
            this.yPoints[this.index++] = y1;
            this.xPoints[this.index]   = x2;
            this.yPoints[this.index++] = y2;
            return this;
        },
        
        /**
         * Appends a cubic Bezier curve to the current path.
         * @param x1 x coordinate of the first control point
         * @param y1 y coordinate of the first control point
         * @param x2 x coordinate of the second control point
         * @param y2 y coordinate of the second control point
         * @param x3 x coordinate of the curve endpoint.
         * @param y3 y coordinate of the curve endpoint.
         */
        curveTo: function(x1, y1, x2, y2, x3, y3) {
            if (x1 instanceof Vector2) {
                var cp1 = x1;
                var cp2 = y1;
                var end = x2;

                if (!(cp2 instanceof Vector2 && end instanceof Vector2))
                    throw 'Cannot mix and match vectors and numbers.';

                y1 = cp1.y;
                x1 = cp1.x;
                y2 = cp2.y;
                x2 = cp2.x;
                y3 = end.y;
                x3 = end.x;
            }
            this.types[this.index] = PiecewiseCurve.SEG_CUBICTO;
            this.xPoints[this.index]   = x1;
            this.yPoints[this.index++] = y1;
            this.xPoints[this.index]   = x2;
            this.yPoints[this.index++] = y2;
            this.xPoints[this.index]   = x3;
            this.yPoints[this.index++] = y3;
            return this;
        },
        
        /**
         * Closes the current subcurve by drawing a line
         * back to the point of the last moveTo, unless the path is already closed.
         */
        close: function() {
            if (this.index >= 1 && this.types[this.index - 1] == PiecewiseCurve.SEG_CLOSE)
                return;
            this.types[this.index] = PiecewiseCurve.SEG_CLOSE;
            this.xPoints[this.index]   = this.xPoints[this.subcurve];
            this.yPoints[this.index++] = this.yPoints[this.subcurve];
            return this;
        },

        /**
         * Evaluates if a rectangle intersects a path.
         */
        intersects: function(x, y, w, h) {
            if (x instanceof Rectangle) {
                h = x.h;
                w = x.w;
                y = x.y;
                x = x.x;
            }

            // Does any edge intersect?
            if (this.getAxisIntersections(x, y,     false, w) !== 0 || 
                this.getAxisIntersections(x, y + h, false, w) !== 0 || 
                this.getAxisIntersections(x + w, y, true,  h) !== 0 || 
                this.getAxisIntersections(x, y,     true,  h) !== 0) {
                return true;
            }

            // No intersections, is any point inside?
            if (this.getWindingNumber(x, y) !== 0)
                return true;

            return false;
        },

        /**
         * Determine whether a point is contained within the bounds of the
         *   closed curve.
         * Can take an object with x and y values or plain x and y values.
         */
        contains: function(x, y) {
            if (_.isObject(x)) {
                y = x.y;
                x = x.x;
            }

            return this.getWindingNumber(x, y) !== 0;
        },

        /**
         * Helper method - Get the total number of intersections from (x,y) along 
         * a given axis, within a given distance.
         */
        getAxisIntersections: function(x, y, useYAxis, distance) {
            return this.evaluateCrossings(x, y, false, useYAxis, distance);
        },

        getWindingNumber: function(x, y) {
            /* Evaluate the crossings from x,y to infinity on the y axis (arbitrary 
             *   choice). Note that we don't actually use Double.INFINITY, since that's 
             *   slower, and may cause problems. 
             */
            return this.evaluateCrossings(x, y, true, true, PiecewiseCurve.BIG_VALUE);
        },

        /**
         * Evaluates the number of intersections on an axis from 
         *   the point (x,y) to the point (x,y+distance) or (x+distance,y).
         *
         * Here is a gist explanation of this algorithm: 
         *   https://gist.github.com/pwolfert/134d6dda882309bf2c5f
         *
         * @param x x coordinate.
         * @param y y coordinate.
         * @param neg True if opposite-directed intersections should cancel, false to sum all intersections.
         * @param useYaxis Use the Y axis, false uses the X axis.
         * @param distance Interval from (x,y) on the selected axis to find intersections.
         */
        evaluateCrossings: function(x, y, neg, useYAxis, distance) {
            var cx = 0;
            var cy = 0;
            var firstx = 0;
            var firsty = 0;

            var negative = (neg) ? -1 : 1;

            var x0;
            var x1;
            var x2;
            var x3;

            var y0;
            var y1;
            var y2;
            var y3;

            var equation = [];
            var roots;
            var a;
            var b;
            var c;
            var t;
            var i;
            var crossing;
            var epsilon = 0.0;
            var pos = 0;
            var windingNumber = 0;
            var pathStarted = false;

            var xPoints = this.xPoints;
            var yPoints = this.yPoints;
            var types   = this.types;

            if (this.index === 0)
                return 0;

            if (useYAxis) {
                // Trade axes
                xPoints = this.yPoints;
                yPoints = this.xPoints;
                var swap = y;
                y = x;
                x = swap;
            }

            /* Get a value which is hopefully small but not insignificant relative the path. */
            epsilon = yPoints[0] * 1E-7;
            
            if (epsilon === 0) 
                epsilon = 1E-7;
            
            pos = 0;
            while (pos < this.index) {
                switch (types[pos]) {
                    case PiecewiseCurve.SEG_MOVETO:
                        if (pathStarted) { // close old path
                            x0 = cx;
                            y0 = cy;
                            x1 = firstx;
                            y1 = firsty;

                            if (y0 === 0)
                                y0 -= epsilon;
                            if (y1 === 0)
                                y1 -= epsilon;
                            if (lineIntersect.linesIntersect(x0, y0, x1, y1, epsilon, 0, distance, 0))
                                windingNumber += (y1 < y0) ? 1 : negative;

                            cx = firstx;
                            cy = firsty;
                        }
                        cx = firstx = xPoints[pos]   - x;
                        cy = firsty = yPoints[pos++] - y;
                        pathStarted = true;
                        break;
                    case PiecewiseCurve.SEG_CLOSE:
                        x0 = cx;
                        y0 = cy;
                        x1 = firstx;
                        y1 = firsty;

                        if (y0 === 0)
                            y0 -= epsilon;
                        if (y1 === 0)
                            y1 -= epsilon;
                        if (lineIntersect.linesIntersect(x0, y0, x1, y1, epsilon, 0, distance, 0))
                            windingNumber += (y1 < y0) ? 1 : negative;

                        cx = firstx;
                        cy = firsty;
                        pos++;
                        pathStarted = false;
                        break;
                    case PiecewiseCurve.SEG_LINETO:
                        x0 = cx;
                        y0 = cy;
                        x1 = xPoints[pos]   - x;
                        y1 = yPoints[pos++] - y;

                        if (y0 === 0)
                            y0 -= epsilon;
                        if (y1 === 0)
                            y1 -= epsilon;
                        if (lineIntersect.linesIntersect(x0, y0, x1, y1, epsilon, 0, distance, 0))
                            windingNumber += (y1 < y0) ? 1 : negative;

                        cx = xPoints[pos - 1] - x;
                        cy = yPoints[pos - 1] - y;
                        break;
                    case PiecewiseCurve.SEG_QUADTO:
                        x0 = cx;
                        y0 = cy;
                        x1 = xPoints[pos]   - x;
                        y1 = yPoints[pos++] - y;
                        x2 = xPoints[pos]   - x;
                        y2 = yPoints[pos++] - y;

                        /* check if curve may intersect X+ axis. */
                        if ((x0 > 0 || x1 > 0 || x2 > 0) && (y0 * y1 <= 0 || y1 * y2 <= 0)) {
                            if (y0 === 0)
                                y0 -= epsilon;
                            if (y2 === 0)
                                y2 -= epsilon;

                            a = y0;
                            b = 2 * (y1 - y0);
                            c = (y2 - 2 * y1 + y0);

                            /* degenerate roots (=tangent points) do not
                            contribute to the winding number. */
                            roots = solveQuadratic(a, b, c);
                            if (roots.length === 2) {
                                for (i = 0; i < roots.length; i++) {
                                    t = roots[i];
                                    if (t > 0 && t < 1) {
                                        crossing = t * t * (x2 - 2 * x1 + x0) + 2 * t * (x1 - x0) + x0;
                                        if (crossing >= 0.0 && crossing <= distance)
                                            windingNumber += (2 * t * (y2 - 2 * y1 + y0) + 2 * (y1 - y0) < 0) ? 1 : negative;
                                    }
                                }
                            }
                        }

                        cx = xPoints[pos - 1] - x;
                        cy = yPoints[pos - 1] - y;
                        break;
                    case PiecewiseCurve.SEG_CUBICTO:
                        x0 = cx;
                        y0 = cy;
                        x1 = xPoints[pos]   - x;
                        y1 = yPoints[pos++] - y;
                        x2 = xPoints[pos]   - x;
                        y2 = yPoints[pos++] - y;
                        x3 = xPoints[pos]   - x;
                        y3 = yPoints[pos++] - y;

                        /* check if curve may intersect X+ axis. */
                        if ((x0 > 0 || x1 > 0 || x2 > 0 || x3 > 0) && (y0 * y1 <= 0 || y1 * y2 <= 0 || y2 * y3 <= 0)) {
                            if (y0 === 0)
                                y0 -= epsilon;
                            if (y3 === 0)
                                y3 -= epsilon;

                            equation[0] = y0;
                            equation[1] = 3 * (y1 - y0);
                            equation[2] = 3 * (y2 + y0 - 2 * y1);
                            equation[3] = y3 - 3 * y2 + 3 * y1 - y0;

                            roots = solveCubic(equation);
                            if (roots.length !== 0) {
                                for (i = 0; i < roots.length; i++) {
                                    t = roots[i];
                                    if (t > 0.0 && t < 1.0) {
                                        crossing = -(t * t * t) * (x0 - 3 * x1 + 3 * x2 - x3)
                                                     + 3 * t * t * (x0 - 2 * x1 + x2)
                                                     + 3 * t * (x1 - x0) + x0;
                                        if (crossing >= 0 && crossing <= distance) {
                                            windingNumber += (3 * t * t * (y3 + 3 * y1 - 3 * y2 - y0)
                                                            + 6 * t * (y0 - 2 * y1 + y2)
                                                            + 3 * (y1 - y0) < 0) ? 1 : negative;
                                        }
                                    }
                                }
                            }
                        }

                        cx = xPoints[pos - 1] - x;
                        cy = yPoints[pos - 1] - y;
                        break;
                }
            }
            
            return windingNumber;
        }

    });

    return PiecewiseCurve;
});

