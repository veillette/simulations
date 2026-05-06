define(function (require, exports, module) {
    'use strict';

    var pointInPolygonFlat = require('./flat');
    var pointInPolygonNested = require('./nested');

    module.exports = function pointInPolygon(point, vs, start, end) {
        if (vs.length > 0 && Array.isArray(vs[0])) {
            return pointInPolygonNested(point, vs, start, end);
        }
        return pointInPolygonFlat(point, vs, start, end);
    };

    module.exports.nested = pointInPolygonNested;
    module.exports.flat = pointInPolygonFlat;
});
