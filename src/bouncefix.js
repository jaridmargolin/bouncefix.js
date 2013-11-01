/*
 * bouncefix.js
 * 
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */

/* ExcludeStart */

// Dependencies
var Fix = require('./fix');

/* ExcludeEnd */

// Define module
module.exports = bouncefix = {
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