/*
 * fix.js
 * 
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */

/* ExcludeStart */

// Dependencies
var EventListener = require('./eventlistener'),
    utils         = require('./utils');

// Define module
module.exports = Fix;

/* ExcludeEnd */

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