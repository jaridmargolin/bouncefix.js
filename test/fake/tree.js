/*
 * test/fake/tree.js:
 *
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */ 

// first party
var Element = require('./element.js');

// define module
module.exports = Tree;

//
// Element Class
//
function Tree(elems) {
  // Hold onto elems as we create them
  this.elems = [];
  // Loop over passed and set up individual elems
  var elemsLength = elems.length;
  for(var i = 0; i < elemsLength; i++) {
    var parent = this.elems[i -1];
    this.elems.push(new Element(elems[i], parent));
  }
}