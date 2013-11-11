/*!
 * v0.2.0
 * Copyright (c) 2013 Jarid Margolin
 * bouncefix.js is open sourced under the MIT license.
 */ 

;(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
  else if (typeof define === 'function' && define.amd) { define(definition); }
  else { context[name] = definition(); }
})('bouncefix', this, function () {
// Define module
var bouncefix = {
  Fix: Fix,
  cache: {}
};  

//
// Add/Create new instance
//
bouncefix.add = function (className) {
  if (!this.cache[className]) {
    this.cache[className] = new this.Fix(className);
  }
};

//
// Delete/Remove instance
//
bouncefix.remove = function (className) {
  if (this.cache[className]) {
    this.cache[className].remove();
    delete this.cache[className];
  }
};
//
// Class Constructor - Called with new BounceFix(el)
// Responsible for setting up required instance
// variables, and listeners.
//
function Fix(className) {
  // If there is no element, then do nothing  
  if(!className) { return false; }
  this.className = className;

  // The engine
  this.startListener = new EventListener(document, {
    evt: 'touchstart',
    handler: this.touchStart,
    context: this
  }).add();

  // Cleanup
  this.endListener = new EventListener(document, {
    evt: 'touchend',
    handler: this.touchEnd,
    context: this
  }).add();
}

//
// touchstart handler
//
Fix.prototype.touchStart = function (evt) {
  this.target = utils.getTargetedEl(evt.target, this.className);
  if (this.target) {
    // If scrollable, adjust
    if (utils.isScrollable(this.target)) { return utils.scrollToEnd(this.target); }
    // Else block touchmove
    this.endListener = new EventListener(this.target, {
      evt: 'touchmove',
      handler: this.touchMove,
      context: this
    }).add();
  }
};

//
// If this event is called, we block scrolling
// by preventing default behavior.
//
Fix.prototype.touchMove = function (evt) {
  evt.preventDefault(); 
};

//
// On touchend we need to remove and listeners
// we may have added.
//
Fix.prototype.touchEnd = function (evt) {
  if (this.moveListener) {
    this.moveListener.remove();
  }
};

//
// touchend handler
//
Fix.prototype.remove = function () {
  this.startListener.remove();
  this.endListener.remove();
};
// Define module
var utils = {};

//
// Search nodes to find target el. Return if exists
//
utils.getTargetedEl = function (el, className) {
  while (true) {
    if (el.classList.contains(className)) { break; }
    if ((el = el.parentElement)) { continue; }
    break;
  }
  return el;
};

//
// Return true or false depending on if content
// is scrollable
//
utils.isScrollable = function (el) {
  return (el.scrollHeight > el.offsetHeight);
};

//
// Keep scrool from hitting end bounds
//
utils.scrollToEnd = function (el) {
  var curPos = el.scrollTop,
      height = el.offsetHeight,
      scroll = el.scrollHeight;
  
  // If at top, bump down 1px
  if(curPos <= 0) { el.scrollTop = 1; }

  // If at bottom, bump up 1px
  if(curPos + height >= scroll) {
    el.scrollTop = scroll - height - 1;
  }
};
//
// Class used to work with addEventListener. Allows
// context to be specified on handler, and provides
// a method for easy removal.
//
function EventListener(el, opts) {
  // Make args available to instance
  this.evt = opts.evt;
  this.el = el;
  // Default
  this.handler = opts.handler;
  // If context passed call with context
  if (opts.context) {
    this.handler = function (evt) {
      opts.handler.call(opts.context, evt);
    };
  }
}

//
// Add EventListener on instance el
//
EventListener.prototype.add = function () {
  this.el.addEventListener(this.evt, this.handler, false);
};

//
// Removes EventListener on instance el
//
EventListener.prototype.remove = function () {
  this.el.removeEventListener(this.evt, this.handler);
};

return bouncefix;

});