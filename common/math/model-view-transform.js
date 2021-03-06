define(function (require) {

    'use strict';

    var _         = require('underscore');
    var Rectangle = require('./rectangle');
    var Vector2   = require('./vector2');
    var PiecewiseCurve = require('./piecewise-curve');

    /**
     * | m00 m01 m02 |
     * | m10 m11 m12 | = m00 * m11 - m01 * m10
     * |  0   0   1  |
     */
    var determinant = function(matrix) {
        return matrix[0] * matrix[4] - matrix[1] * matrix[3];
    };

    /**
     * From the source of java.awt.geom.AffineTransform
     */
    var inverse = function(matrix) {
        var a = matrix;
        var m00 = a[0], m01 = a[1], m02 = a[2],
            m10 = a[3], m11 = a[4], m12 = a[5];

        var det = determinant(matrix);
        if (det === 0) 
            throw 'Cannot invert this transformation matrix--zero determinant';

        var inv00, inv01, inv02,
            inv10, inv11, inv12;

        inv00 = m11 / det;
        inv10 = -m10 / det;
        inv01 = -m01 / det;
        inv11 = m00 / det;
        inv02 = (m01 * m12 - m02 * m11) / det;
        inv12 = (-m00 * m12 + m10 * m02) / det;

        return [
            inv00, inv01, inv02,
            inv10, inv11, inv12
        ];
    };

    /**
     *  Returns an array of straight integer components where
     *    the arguments can be any mix of integers and objects
     *    that have properties for x and y.
     */
    // Don't need it right now
    // var componentsFromArguments = function(args, numRequired, defaultValue) {
    //     var i;
    //     var components = [];
    //     for (i = 0; i < args.length; i++) {
    //         if (i === args.length) {
    //             throw 'Invalid arguments given: ' + args;
    //         }
    //         else if (_.isObject(args[i])) {
    //             if ('x' in args[i] && 'y' in args[i]) {
    //                 components.push(args[i].x);
    //                 components.push(args[i].y);
    //                 i++;
    //             }
    //             else {
    //                 throw 'Invalid arguments given: ' + args;
    //             }
    //         }
    //         else {
    //             components.push(args[i]);
    //         }
    //     }
        
    //     if (components.length < numRequired && defaultValue !== undefined) {
    //         i = components.length - 1;
    //         while (i < numRequired) {
    //             components[i] = defaultValue;
    //             i++;
    //         }
    //     }
        
    //     return components;
    // };

    /**
     * This is the equivalent of PhET's 
     *   phetcommon.view.graphics.transforms.ModelViewTransform,
     *   which stores a transformation for model coordinates to
     *   view coordinates and provides helper functions to
     *   perform some of those transformations.
     */
    var ModelViewTransform = function(transformationMatrix) {

        this.transformMatrix = transformationMatrix || [
            1, 0, 0,
            0, 1, 0
        ];

        this.generateDerivedTransformMatrices();

        // Cached objects for recycling
        this._point = new Vector2();
        this._rect  = new Rectangle();
        this._point1 = new Vector2();
        this._point2 = new Vector2();
        this._point3 = new Vector2();
        this._point4 = new Vector2();
        this._scale = new Vector2();
    };

    /**
     * Static functions
     */
    _.extend(ModelViewTransform, {

        /**
         * Creates a ModelViewTransform that just has a scale, such that
         *   view = model * scale
         *
         * @param xScale the scale to map model to view in the x-dimension
         * @param yScale the scale to map model to view in the y-dimension
         */
        createScaleMapping: function(xScale, yScale) {
            if (yScale === undefined)
                yScale = xScale;

            return new ModelViewTransform([
                xScale, 0,      0,
                0,      yScale, 0
            ]);
        },

        /**
         * Creates a ModelViewTransform that has the specified scale 
         *   and offset such that
         *   view = model * scale + offset
         *
         * @param offset the offset in view coordinates
         * @param xScale the scale to map model to view in the x-dimension
         * @param yScale the scale to map model to view in the y-dimension
         */
        createOffsetScaleMapping: function(offset, xScale, yScale) {
            if (yScale === undefined)
                yScale = xScale;

            return new ModelViewTransform([
                xScale, 0,      offset.x,
                0,      yScale, offset.y
            ]);
        },

        /**
         * Creates a shearless ModelViewTransform that maps the 
         *   specified model point to the specified view point, 
         *   with the given x and y scales.
         *
         * @param modelPoint the reference point in the model which maps to the specified view point
         * @param viewPoint  the reference point in the view
         * @param xScale     the amount to scale in the x direction
         * @param yScale     the amount to scale in the y direction
         * @return the resultant ModelViewTransform
         */
        createSinglePointScaleMapping: function(modelPoint, viewPoint, xScale, yScale) {
            if (yScale === undefined)
                yScale = xScale;

            var xOffset = viewPoint.x - modelPoint.x * xScale;
            var yOffset = viewPoint.y - modelPoint.y * yScale;

            return ModelViewTransform.createOffsetScaleMapping(new Vector2(xOffset, yOffset), xScale, yScale);
        },

        /**
         * Creates a shearless ModelViewTransform that maps the 
         *   specified model point to the specified view point, 
         *   with the given scale factor for both x and y 
         *   dimensions, but inverting the y axis so that +y in 
         *   the model corresponds to -y in the view. Inverting 
         *   the y axis is commonly necessary since +y is usually 
         *   up in textbooks and -y is down in pixel coordinates.
         *
         * @param modelPoint the reference point in the model which maps to the specified view point
         * @param viewPoint  the reference point in the view
         * @param scale      the amount to scale in the x and y directions
         * @return the resultant ModelViewTransform
         */
        createSinglePointScaleInvertedYMapping: function(modelPoint, viewPoint, scale) {
            return ModelViewTransform.createSinglePointScaleMapping(modelPoint, viewPoint, scale, -scale);
        },

        /**
         * Creates a shearless ModelViewTransform that maps the specified rectangle in the model to the specified rectangle in the view,
         * so that any point x% of the way across and y% down in the model rectangle will be mapped to the corresponding point x% across and y% down in the view rectangle.
         * Linear extrapolation is performed outside of the rectangle bounds.
         *
         * @param modelBounds the reference rectangle in the model, must have area > 0
         * @param viewBounds  the reference rectangle in the view, must have area > 0
         * @return the resultant ModelViewTransform
         */
        createRectangleMapping: function(modelBounds, viewBounds) {
            var m00 = viewBounds.w / modelBounds.w;
            var m02 = viewBounds.x - m00 * modelBounds.x;
            var m11 = viewBounds.h / modelBounds.h;
            var m12 = viewBounds.y - m11 * modelBounds.y;

            return new ModelViewTransform([
                m00, 0, m02,
                0, m11, m12
            ]);
        }

    });

    /**
     * Instance functions
     */
    _.extend(ModelViewTransform.prototype, {

        generateDerivedTransformMatrices: function() {
            // Delta transform just takes out the translation
            this.deltaTransformMatrix = _.clone(this.transformMatrix);
            this.deltaTransformMatrix[2] = 0;
            this.deltaTransformMatrix[5] = 0;

            // Get the inverse of the transform matrix and store it
            this.inverseTransformMatrix = inverse(this.transformMatrix);

            // Delta transform just takes out the translation
            this.deltaInverseTransformMatrix = _.clone(this.inverseTransformMatrix);
            this.deltaInverseTransformMatrix[2] = 0;
            this.deltaInverseTransformMatrix[5] = 0;
        },

        /*************************************************************************
         **                                                                     **
         **                            Model to View                            **
         **                                                                     **
         *************************************************************************/

        modelToView: function(coordinates) {
            return this.transform(this.transformMatrix, coordinates);
        },

        /**
         * Delta transform just doesn't include any translation
         */
        modelToViewDelta: function(coordinates) {
            return this.transform(this.deltaTransformMatrix, coordinates);
        },

        /**
         * For things like bounds that we want to only transform
         *   by the scale. Works the same as modelToViewDelta but
         *   has a different name so its function is clearer.
         */
        modelToViewScale: function(coordinates) {
            return this.modelToViewDelta(coordinates);
        },

        modelToViewX: function(x) {
            return this.transformPoint(this.transformMatrix, this._point1.set(x, 0)).x;
        },

        modelToViewY: function(y) {
            return this.transformPoint(this.transformMatrix, this._point1.set(0, y)).y;
        },

        modelToViewDeltaX: function(x) {
            return this.transformPoint(this.deltaTransformMatrix, this._point1.set(x, 0)).x;
        },

        modelToViewDeltaY: function(y) {
            return this.transformPoint(this.deltaTransformMatrix, this._point1.set(0, y)).y;
        },

        /*************************************************************************
         **                                                                     **
         **                            View to Model                            **
         **                                                                     **
         *************************************************************************/

        viewToModel: function(coordinates) {
            return this.transform(this.inverseTransformMatrix, coordinates);
        },

        viewToModelDelta: function(coordinates) {
            return this.transform(this.deltaInverseTransformMatrix, coordinates);
        },

        viewToModelScale: function(coordinates) {
            return this.viewToModelDelta(coordinates);
        },

        viewToModelX: function(x) {
            return this.transformPoint(this.inverseTransformMatrix, this._point1.set(x, 0)).x;
        },

        viewToModelY: function(y) {
            return this.transformPoint(this.inverseTransformMatrix, this._point1.set(0, y)).y;
        },

        viewToModelDeltaX: function(x) {
            return this.transformPoint(this.deltaInverseTransformMatrix, this._point1.set(x, 0)).x;
        },

        viewToModelDeltaY: function(y) {
            return this.transformPoint(this.deltaInverseTransformMatrix, this._point1.set(0, y)).y;
        },

        /*************************************************************************
         **                                                                     **
         **                           Transformations                           **
         **                                                                     **
         *************************************************************************/

        transform: function(tm, coordinates) {
            if (coordinates instanceof Rectangle)
                return this.transformRectangle(tm, coordinates);
            else if (coordinates instanceof Vector2 || ('x' in coordinates && 'y' in coordinates))
                return this.transformPoint(tm, coordinates);
            else if (coordinates instanceof PiecewiseCurve)
                return this.transformPiecewiseCurve(tm, coordinates);
        },

        transformPoint: function(tm, point) {
            this._point.x = tm[0] * point.x + tm[1] * point.y + tm[2];
            this._point.y = tm[3] * point.x + tm[4] * point.y + tm[5];
            return this._point;
        },

        transformRectangle: function(tm, rectangle) {
            // Create points for the rectangle's points and transform them
            var corner1 = this._point1;
            var corner2 = this._point2;

            corner1.set(rectangle.x, rectangle.y);
            corner2.set(rectangle.x + rectangle.w, rectangle.y + rectangle.h);

            corner1.set(this.transformPoint(tm, corner1));
            corner2.set(this.transformPoint(tm, corner2));

            return this._rect.set(
                corner1.x,
                corner1.y,
                Math.abs(corner2.x - corner1.x),
                Math.abs(corner2.y - corner1.y)
            );
        },

        transformPiecewiseCurve: function(tm, curve) {
            var clone = curve.clone();
            clone.transform(tm);
            return clone;
        },

        scale: function(scaleX, scaleY) {
            if (scaleX === undefined) {
                return this._scale.set(
                    this.transformMatrix[0],
                    this.transformMatrix[4]
                );
            }
            else {
                if (scaleY === undefined)
                    scaleY = scaleX;
                this.transformMatrix[0] = scaleX;
                this.transformMatrix[4] = scaleY;
                this.generateDerivedTransformMatrices();
            }
        },

        scaleX: function(scaleX) {
            if (scaleX === undefined)
                return this.transformMatrix[0];
            else 
                this.scale(scaleX, this.scaleY());
        },

        scaleY: function(scaleY) {
            if (scaleY === undefined)
                return this.transformMatrix[4];
            else 
                this.scale(this.scaleX(), scaleY);
        },

        getXScale: function() {
            return this.transformMatrix[0];
        },

        getYScale: function() {
            return this.transformMatrix[4];
        }

    });

    return ModelViewTransform;
});

