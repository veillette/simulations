define(function(require) {

    'use strict';

    var _        = require('underscore');
    var Backbone = require('backbone');
    var PIXI     = require('pixi');
    var PixiView = require('../view');

    /**
     * Hybrid view also has an $el/el property that behaves
     *   like the Backbone.View.  Events can be defined for
     *   the element and its decendents with the htmlEvents
     *   property.
     */
    var HybridView = PixiView.extend({

        htmlEvents: {},

        tagName: Backbone.View.prototype.tagName,

        constructor: function() {
            this.cid = _.uniqueId('view');
            this._ensureElement();
            this.delegateHtmlEvents();

            PixiView.apply(this, arguments);
        },

        _createElement: Backbone.View.prototype._createElement,
        _setElement:    Backbone.View.prototype._setElement,
        _setAttributes: Backbone.View.prototype._setAttributes,
        _ensureElement: Backbone.View.prototype._ensureElement,

        delegateHtmlEvents: function() {
            Backbone.View.prototype.delegateEvents.apply(this, [ this.htmlEvents ]);
        },

        delegate:         Backbone.View.prototype.delegate,
        undelegateEvents: Backbone.View.prototype.undelegateEvents,

        // Backbone >= 1.2 setElement calls delegateEvents(), which fires PixiView's
        // Pixi event binding before initialize() has created the display objects.
        // We strip that call out here; Pixi events are delegated by PixiView's
        // constructor after initialize(), and HTML events by delegateHtmlEvents().
        setElement: function(element) {
            this._setElement(element);
            return this;
        }

    });

    return HybridView;
});
