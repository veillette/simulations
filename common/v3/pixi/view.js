define(function(require) {

    'use strict';

    var _        = require('underscore');
    var Backbone = require('backbone');
    var PIXI     = require('pixi');
    var version = (PIXI.VERSION || '').replace(/^v/i, '');
    var majorVersion = parseInt(version.split('.')[0], 10);

    var parseLegacyFontString = function(fontString) {
        if (typeof fontString !== 'string')
            return null;

        var sizeMatch = fontString.match(/(\d+(?:\.\d+)?)px/);
        if (!sizeMatch)
            return null;

        var fontSize = parseFloat(sizeMatch[1]);
        var sizeToken = sizeMatch[0];
        var sizeIndex = fontString.indexOf(sizeToken);
        var familyStart = sizeIndex + sizeToken.length;
        var fontFamily = fontString.slice(familyStart).trim();
        if (!fontFamily)
            fontFamily = 'Arial';

        var fontStyle = /\b(italic|oblique)\b/i.exec(fontString);
        var fontWeight = /\b(bold|bolder|lighter|[1-9]00)\b/i.exec(fontString);

        return {
            fontSize: fontSize,
            fontFamily: fontFamily,
            fontStyle: fontStyle ? fontStyle[1] : 'normal',
            fontWeight: fontWeight ? fontWeight[1] : 'normal'
        };
    };

    if (PIXI.Text && !PIXI.Text.__legacyFontCompatibilityPatched) {
        var OriginalPixiText = PIXI.Text;
        var PatchedPixiText = function(text, style, canvas) {
            if (style && style.font && style.fontSize === undefined && style.fontFamily === undefined) {
                var normalized = parseLegacyFontString(style.font);
                if (normalized)
                    style = _.extend({}, style, normalized);
            }
            return new OriginalPixiText(text, style, canvas);
        };

        PatchedPixiText.prototype = OriginalPixiText.prototype;
        _.extend(PatchedPixiText, OriginalPixiText);
        PatchedPixiText.__legacyFontCompatibilityPatched = true;
        PIXI.Text = PatchedPixiText;
    }

    var viewOptions = ['model', 'id', 'displayObject', 'events'];

    var delegateEventSplitter = /^(\S+)\s*\.(\S*)$/;
    var legacyToPointerEventMap = {
        touchstart: 'pointerdown',
        mousedown: 'pointerdown',
        touchmove: 'pointermove',
        mousemove: 'pointermove',
        touchend: 'pointerup',
        mouseup: 'pointerup',
        touchendoutside: 'pointerupoutside',
        mouseupoutside: 'pointerupoutside'
    };
    var shouldUsePointerEvents = !isNaN(majorVersion) && majorVersion >= 5;

    /**
     * A View class that acts like the Backbone.View class, complete
     *   with Backbone Events, but it's for a Pixi.js DisplayObject
     *   instead of an HTML element.
     */
    var PixiView = function(options) {
        // Next few lines modeled after Backbone.View's constructor
        if (!options)
            options = {};
        _.extend(this, _.pick(options, viewOptions));
        this._ensureDisplayObject();
        this.initialize.apply(this, arguments);
        this.delegateEvents();
    };

    /**
     * Let the prototype get extended by the Backbone.Events object
     *   so we have all that nice event functionality.
     */
    _.extend(PixiView.prototype, Backbone.Events, {

        /**
         * Field variables
         */
        displayObject: null,
        model: null,

        /**
         * Initialization code for new PixiView objects
         */
        initialize: function(options) {},

        /**
         * This function should contain all the necessary code for
         *   updating the displayObject before the next frame renders.
         */
        update: function(time, delta) {

        },

        /**
         * Makes sure there's a displayObject specified.  If there
         *   is no displayObject instance given, it creates one.
         */
        _ensureDisplayObject: function() {
            if (!this.displayObject) {
                /* Could try to store class names and build an actual
                 *   Pixi DisplayObject off of a name with something
                 *   like "new PIXI[className]", but then I'd have to
                 *   specify different kinds of parameters for their
                 *   constructors and stuff.  But it could be an
                 *   option in the future.
                 */
                this.initializeDisplayObject();
            }
        },

        /**
         * Initializes a new DisplayObjectContainer as the view's
         *   displayObject, which should work for general purposes.
         */
        initializeDisplayObject: function() {
            this.displayObject = new PIXI.Container();
        },

        /**
         * Modeled after Backbone.View.prototype.delegateEvents, this
         *   function takes a map of event bindings that looks like:
         *
         *     {
         *       'touchstart .displayObject': 'dragStart'
         *     }
         *
         *   and binds functions to them like this:
         *
         *     this.displayObject.touchstart = this.dragStart;
         */
        delegateEvents: function(events) {
            this.undelegateEvents();

            if (!(events || (events = _.result(this, 'events')))) 
                return this;

            this._delegatedPixiEvents = [];

            for (var key in events) {
                if (events.hasOwnProperty(key)) {
                    var method = events[key];
                    if (!_.isFunction(method))
                        method = this[events[key]];
                    if (!method)
                        continue;

                    var match = key.match(delegateEventSplitter);
                    var eventName = match[1];
                    var displayObject = this[match[2]];
                    var normalizedEventName = shouldUsePointerEvents ?
                        (legacyToPointerEventMap[eventName] || eventName) :
                        eventName;

                    if (!(displayObject instanceof PIXI.DisplayObject))
                        throw 'PixiView: this.' + match[2] + ' must be a DisplayObject to bind events on it.';

                    // if (displayObject.hasOwnProperty(eventName))
                    //     throw 'PixiView: ' + eventName + ' is not a valid event.';

                    var boundMethod = _.bind(method, this);
                    displayObject.on(normalizedEventName, boundMethod);
                    displayObject.interactive = true;
                    this._delegatedPixiEvents.push({
                        displayObject: displayObject,
                        eventName: normalizedEventName,
                        listener: boundMethod
                    });
                }
            }

            return this;
        },

        undelegateEvents: function() {
            if (this._delegatedPixiEvents) {
                _.each(this._delegatedPixiEvents, function(binding) {
                    binding.displayObject.off(binding.eventName, binding.listener);
                });
            }
            this._delegatedPixiEvents = [];
            return this;
        },

        /** 
         * Removes the displayObject from its parent and unbinds
         *   event listeners for the model.
         */
        removeFrom: function(parentDisplayObject) {
            if (parentDisplayObject !== undefined)
                parentDisplayObject.removeChild(this.displayObject);
            if (this.model)
                this.stopListening(this.model);
        },

        detach: function() {
            if (this.displayObject.parent)
                this.displayObject.parent.removeChild(this.displayObject);
        },

        remove: function() {
            this.undelegateEvents();
            this.detach();
            if (this.model)
                this.stopListening(this.model);
        },

        getResolution: function() {
            return window.devicePixelRatio ? window.devicePixelRatio : 1;
        },

        show: function() {
            this.displayObject.visible = true;
        },

        hide: function() {
            this.displayObject.visible = false;
        }

    });

    /**
     * If you read the annotated source for Backbone, in the helpers
     *   section, all the Backbone classes (Model, Collection, View,
     *   etc.) have .extend that references the same function:
     *
     *     Model.extend = Collection.extend = ... = extend;
     * 
     *   This function isn't directly exposed if I require Backbone,
     *   but I could just cheat and grab it off of any old Backbone
     *   object prototype, so I will :)
     */
    PixiView.extend = Backbone.View.extend;


    return PixiView;
});