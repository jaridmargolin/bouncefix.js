/*
 * eventlistener.js
 * 
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */

/* ExcludeStart */

// Define module
module.exports = EventListener;

/* ExcludeEnd */

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
