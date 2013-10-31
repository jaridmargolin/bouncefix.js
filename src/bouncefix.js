/*
 * bouncefix.js
 * 
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */

/* ExcludeStart */
var EventListener = require('./eventlistener');
/* ExcludeEnd */

// Define module
module.exports = bouncefix = {
  BounceFix: BounceFix,
  fixCache: [],
  elCache: []
};  

//
// Add new instance
//
bouncefix.add = function (el) {
  if (this.elCache.indexOf(el) < 0) {
    this.elCache.push(el);
    this.fixCache.push(new BounceFix(el));
  }
  return this.fixCache[this.fixCache.length - 1];
};

//
// Remove instance
//
bouncefix.remove = function (el) {
  var index = this.elCache.indexOf(el);
  if (index >= 0) {
    this.fixCache[index].remove();
    this.elCache.splice(index, 1);
    this.fixCache.splice(index, 1);
  }
};

//
// Class Constructor - Called with new BounceFix(el)
// Responsible for setting up required instance
// variables, and listeners.
//
function BounceFix(el) {
  // If there is no element, then do nothing  
  if(!el) { return false; }
  // Elem should be accesible by instance
  this.el = el;

  // Setup listeners
  this.startListener = new EventListener(this.el, {
    evt: 'touchstart',
    handler: this._scrollToEnd,
    context: this
  });
  this.moveListener = new EventListener(this.el, {
    evt: 'touchmove',
    handler: function (evt) {
      evt.preventDefault();
    }
  });

  // Observe any changes to node contents
  this.observer = this._addObserver();

  // Set initial state
  this._manageState();
}

//
// Observe node for dom manipulation
//
BounceFix.prototype._addObserver = function () {
  // Cache this
  var self = this;
  // Setup Observer
  var observer = new MutationObserver(function (mutations) {
    self._manageState(mutations);
  });
  // Begin observing
  observer.observe(this.el, {
    childList: true,
    attributes:true,
    subtree: true
  });
  // Return observer
  return observer;
};

//
// Manage which state the instance is in. If the item
// is scrolable, we enable, and if it is not, we disable
//
BounceFix.prototype._manageState = function (mutations) {
  return (this.el.scrollHeight > this.el.offsetHeight)
    ? this._enable()
    : this._disable();
};

//
// Keep scrool from hitting end bounds
//
BounceFix.prototype._scrollToEnd = function (evt) {
  var curPos = this.el.scrollTop,
      height = this.el.offsetHeight,
      scroll = this.el.scrollHeight;
  
  // If at top, bump down 1px
  if(curPos <= 0) { this.el.scrollTop = 1; }

  // If at bottom, bump up 1px
  if(curPos + height >= scroll) {
    this.el.scrollTop = scroll - height - 1;
  }
};

//
// Enable bouncefix fix and allow scrolling
// on element. Used when item is scrollable
//
BounceFix.prototype._enable = function () {
  if (!this.enabled) {
    this.startListener.add();
    this.moveListener.remove();
    this.enabled = true;
  }
};

//
// Disable bouncefix fix and prevent all scrolling
// on element. Used when item is not scrollable
//
BounceFix.prototype._disable = function () {
  if (typeof this.enabled == 'undefined' || this.enabled) {
    this.startListener.remove();
    this.moveListener.add();
    this.enabled = false;
  }
};

//
// Remove all instance listeners
//
BounceFix.prototype.remove = function () {
  this.startListener.remove();
  this.moveListener.remove();
  this.observer.disconnect();
};
