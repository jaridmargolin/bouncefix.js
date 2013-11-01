/*
 * test/fake-element/element.js:
 *
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */ 

// stdlib
var EventEmitter = require('events').EventEmitter;

// define module
module.exports = Element;


//
// Element Class
//
function Element(classList, parent) {
  // Defaults
  this.offsetHeight = 0;
  this.scrollHeight = 0;
  this.scrollTop    = 0;
  // Setup
  this.listeners = [];
  // Parent elements - for testing
  this.classList = new ClassList(classList || []);
  this.parentElement = parent || null;
}

// Inherits from EventEmitter
Element.prototype = Object.create(EventEmitter.prototype);
Element.prototype.constructor = Element;

//
// Helper method to get listener based on provided
// evt, and handler.
//
Element.prototype._getListener = function (evt, handler) {
  var listLength = this.listeners.length;
  for (var i = 0; i < listLength; i++) {
    var item = this.listeners[i];
    if (item.evt == evt && item.handler == handler) {
      return i;
    }
  }
  // If we haven't returned yet, it must not exist
  return false;
};

//
// Fake addEventListener
//
Element.prototype.addEventListener = function (evt, handler) {
  // Check for existence
  if (!this._getListener(evt, handler)) {
    this.listeners.push({ evt: evt, handler: handler });
    this.addListener(evt, handler);
  }
};

//
// Fake removeEventListener
//
Element.prototype.removeEventListener = function (evt, handler) {
  var index = this._getListener(evt, handler);
  if (index || index === 0) {
    this.listeners.splice(index, 1);
    this.removeListener(evt, handler);
  }
};

//
// Fake preventDefault
//
Element.prototype.preventDefault = function () {
  return true;
};

//
// Fake classList
//
function ClassList(classList) {
  this.length = classList.length;
  for (var i = 0; i < this.length; i++) {
    this[i] = classList[i];
  }
}

ClassList.prototype.contains = function (className) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == className) {
      return true;
    }
  }
  return false;
};