(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['bouncefix'] = factory();
  }
}(this, function () {

/*!
 * dom-event.js
 * 
 * Copyright (c) 2014
 */
var domEventDomEvent, bouncefix;
domEventDomEvent = function () {
  /* -----------------------------------------------------------------------------
   * DOMEvent
   * ---------------------------------------------------------------------------*/
  /**
   * Convenient class used to work with addEventListener.
   *
   * @example
   * var listener = new DOMEvent(document, 'touchstart', handler, this);
   *
   * @constructor
   * @public
   *
   * @param {object} el - Element to add the EventListener on.
   * @param {string} eventName - Name of the event to listen for.
   * @param {function} handler - Function called when event is fired.
   *   Passed `evt` as the first argument.
   * @param {object} context - Conetext to call handler with.
   */
  var DOMEvent = function (el, eventName, handler, context) {
    // Make args available to instance
    this.el = el;
    this.eventName = eventName;
    this.handler = handler;
    this.context = context;
    // Attach
    this.add();
  };
  /**
   * Remove the EventListener
   *
   * @example
   * listener.remove();
   *
   * @public
   */
  DOMEvent.prototype.remove = function () {
    this.el.removeEventListener(this.eventName, this.cachedHandler);
  };
  /**
   * Add the `EventListener`. This method is called internally in
   * the constructor. It can also be used to re-attach a listener
   * that was previously removed.
   *
   * @private
   */
  DOMEvent.prototype.add = function () {
    // Cache this
    var self = this;
    // Cache handler so it can be removed.
    self.cachedHandler = function (e) {
      self._handler.call(self, e, this);
    };
    // Modified handler
    self.el.addEventListener(self.eventName, self.cachedHandler, false);
  };
  /**
   * Handler that manages context, and normalizes both 
   * preventDefault and stopPropagation.
   *
   * @private
   *
   * @param {string} name - Name of event to listen for.
   * @param {object} event - Raw event object. 
   */
  DOMEvent.prototype._handler = function (e, context) {
    // Copy props to new evt object. This is shallow.
    // Only done so that I can modify stopPropagation
    // and preventDefault.
    var evt = {};
    for (var k in e) {
      evt[k] = e[k];
    }
    // Normalize stopPropagation
    evt.stopPropagation = function () {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
    };
    // Normalize preventDefault
    evt.preventDefault = function () {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    };
    // Call with context and modified evt.
    this.handler.call(this.context || context, evt);
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return DOMEvent;
}();
/*
 * bouncefix.js
 */
bouncefix = function (require) {
  /* -----------------------------------------------------------------------------
   * dependencies
   * ---------------------------------------------------------------------------*/
  var DOMEvent = domEventDomEvent;
  /* -----------------------------------------------------------------------------
   * bouncefix
   * ---------------------------------------------------------------------------*/
  /**
   * @global
   * @public
   * @namespace bouncefix
   *
   * @desc Stop full body elastic scroll bounce when scrolling inside nested
   *   containers (IOS specific).
   */
  return {
    selectors: {},
    listeners: {},
    /**
     * @public
     * @memberof bouncefix
     *
     * @desc Initialize bouncefix by begiing to listent on document touch events.
     *  Allows for optionally passing in a selectorStr of items to apply fix for.
     *
     * @example
     * bouncefix.initialize('.scrollable, .content');
     *
     * @param {string} selectorStr - Query selector(s) in which to apply fix for.
     *   Can specify multiple selectors by seperating with `,`.
     */
    initialize: function (selectorStr) {
      // As this library is only required by iOS we have no need to pollyfill
      // matches. We can simply exit if it doesn't exist because it means we
      // can't possibly be on iOS.
      if (!Element.prototype.matches) {
        return;
      }
      if (selectorStr) {
        this.add(selectorStr);
      }
      // On touchstart determine if we should block scrolling. On touchend,
      // cleanup any temporary events created.
      if (!this.initialized) {
        this._addListener(document, 'touchstart', this._onTouchStart);
        this._addListener(document, 'touchend', this._onTouchEnd);
      }
      this.initialized = true;
    },
    /**
     * @public
     * @memberof bouncefix
     *
     * @desc Add bouncefix to specified item.
     *
     * @example
     * bouncefix.add('.scrollable, .content');
     *
     * @param {string} selectorStr - Query selector(s) in which to apply fix for.
     *   Can specify multiple selectors by seperating with `,`.
     */
    add: function (selectorStr) {
      // Hold a map of selectors. These selectors will be utilized during touch
      // event delegation to determine if an item being scrolled should have the
      // fix applied.
      this._eachSelector(selectorStr, function (selector) {
        this.selectors[selector] = true;
      });
    },
    /**
     * @public
     * @memberof bouncefix
     *
     * @desc Remove the scroll fix from a specified selector. If no selector is
     *   passed, the fix will be removed for all selectors.
     *
     * @example
     * bouncefix.remove('.scrollable');
     * bouncefix.remove();
     *
     * @param {string} selectorStr - Query selector(s) in which to remove fix from.
     *   Can specify multiple selectors by seperating with `,`.
     */
    remove: function (selectorStr) {
      if (!selectorStr) {
        return this.selectors = {};
      }
      this._eachSelector(selectorStr, function (selector) {
        delete this.selectors[selector];
      });
    },
    /**
     * @public
     * @memberof bouncefix
     *
     * @desc The oposite of initialize. Used to remove all document listeners
     *   and reset bouncefix to its initial state.
     *
     * @example
     * bouncefix.teardown();
     */
    teardown: function () {
      this.remove();
      for (var eventName in this.listeners) {
        this._removeListener(eventName);
      }
    },
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Take a query selectorStr and call an iterator for each comma seperated
     *   selector. Automatically call iterator with bouncefix as context.
     *
     * @param {string} selectorStr - Query selector(s) in which to remove fix from.
     *   Can specify multiple selectors by seperating with `,`.
     */
    _eachSelector: function (selectorStr, iterator) {
      var selectors = selectorStr.replace(/\s+/g, '').split(',');
      for (var i = 0, l = selectors.length; i < l; i++) {
        iterator.call(this, selectors[i]);
      }
    },
    /* -----------------------------------------------------------------------------
     * touch handlers
     * ---------------------------------------------------------------------------*/
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Handler called on touch start. Determines user intent and applies fix
     *   accordingly.
     */
    _onTouchStart: function (evt) {
      var el = evt.targetTouches[0].target;
      // operating on a scrollable element. Just need to make sure it isn't at
      // a boundary.
      var fixEl = this._getFirstTargetedEl(el);
      if (fixEl && this._isScrollable(fixEl)) {
        return this._scrollToEnd(fixEl);
      }
      // we need to take percaution against body scroll
      this.canScrollUp = !!this._getElFromTree(el, this._canScrollUp);
      this.canScrollDown = !!this._getElFromTree(el, this._canScrollDown);
      this.touchStartY = evt.targetTouches[0].screenY;
      this.disableScroll = false;
      this._addListener(el, 'touchmove', this._onTouchMove);
    },
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Cleanup event listeners applied on touchStart.
     */
    _onTouchMove: function (evt) {
      if (this.disableScroll) {
        return evt.preventDefault();
      }
      var scrollingUp = evt.targetTouches[0].screenY > this.touchStartY;
      var scrollingDown = evt.targetTouches[0].screenY < this.touchStartY;
      if (!(scrollingUp && this.canScrollUp) && !(scrollingDown && this.canScrollDown)) {
        this.disableScroll = true;
        return evt.preventDefault();
      }
    },
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Cleanup event listeners applied on touchStart.
     */
    _onTouchEnd: function (evt) {
      this._removeListener('touchmove');
    },
    /* -----------------------------------------------------------------------------
     * DOM helpers
     * ---------------------------------------------------------------------------*/
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Search nodes to find target el. Return if exists.
     */
    _getFirstTargetedEl: function (el) {
      return this._getElFromTree(el, function (el) {
        var ret = false;
        for (var selector in this.selectors) {
          if (el.matches(selector)) {
            return ret = true;
          }
        }
        return ret;
      });
    },
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Helper used to traverse DOM tree from a specified node, looking for
     *   an element that matches a given condition.
     */
    _getElFromTree: function (el, condition) {
      if (el === document.body) {
        return;
      }
      return condition.call(this, el) ? el : this._getElFromTree(el.parentNode, condition);
    },
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Return true or false depending on if content is scrollable.
     */
    _isScrollable: function (el) {
      return el.scrollHeight > el.offsetHeight;
    },
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Keep scroll from hitting end bounds.
     */
    _scrollToEnd: function (el) {
      var curPos = el.scrollTop;
      var height = el.offsetHeight;
      var scroll = el.scrollHeight;
      // If at top, bump down 1px
      if (curPos <= 0) {
        el.scrollTop = 1;
      }
      // If at bottom, bump up 1px
      if (curPos + height >= scroll) {
        el.scrollTop = scroll - height - 1;
      }
    },
    /* -----------------------------------------------------------------------------
     * scroll tests
     * ---------------------------------------------------------------------------*/
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Determine if specified el can scroll up.
     */
    _canScrollUp: function (el) {
      return el.scrollTop > 0;
    },
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Determine if specified el can scroll down.
     */
    _canScrollDown: function (el) {
      var isScrollable = el.scrollHeight > el.clientHeight;
      var atBoundary = el.scrollHeight - el.clientHeight === el.scrollTop;
      return isScrollable && !atBoundary;
    },
    /* -----------------------------------------------------------------------------
     * listener helpers
     * ---------------------------------------------------------------------------*/
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Add a document event listener.
     *
     * @param {string} eventName - Name of listener to remove.
     */
    _addListener: function (el, eventName, handler) {
      this.listeners[eventName] = new DOMEvent(el, eventName, handler, this);
    },
    /**
     * @private
     * @memberof bouncefix
     *
     * @desc Remove a document event listener.
     *
     * @param {string} eventName - Name of listener to remove.
     */
    _removeListener: function (listenerName) {
      if (this.listeners[listenerName]) {
        this.listeners[listenerName].remove();
        delete this.listeners[listenerName];
      }
    }
  };
}({});

return bouncefix;


}));