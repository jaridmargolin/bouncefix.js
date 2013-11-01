/*
 * utils.js
 * 
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */

/* ExcludeStart */

// Dependencies
var EventListener = require('./eventlistener');

/* ExcludeEnd */

// Define module
module.exports = utils = {};

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