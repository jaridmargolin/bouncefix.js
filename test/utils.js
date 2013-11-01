/*
 * test/bouncefix.js:
 *
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */ 

// 3rd party
var should  = require('chai').should(),
    assert  = require('chai').assert;

// first party
var utils = require('../src/utils'),
    Tree  = require('./fake/tree');


//
// bouncefix.js tests
//
describe('utils.js', function () {

  // Create DOM Tree
  var tree = new Tree([
    ['isParent'],
    ['exists', 'isContent'],
    ['isChild']
  ]);

  // Our element
  var el = tree.elems[1];

  describe('getTargetedEl', function () {
    it('Should return null if not found', function () {
      var target = tree.elems[2];
      assert.isNull(utils.getTargetedEl(target, 'doesntexist'));
    });
    it('Should return el if found', function () {
      var target = tree.elems[2];
      assert.isObject(utils.getTargetedEl(target, 'exists'));
    });
  });

  describe('isScrollable', function () {
    it('Should return false if not scrollable', function () {
      el.scrollTop    = 0;
      el.offsetHeight = 500;
      el.scrollHeight = 500;
      // Check
      assert.isFalse(utils.isScrollable(el));
    });
    it('Should return true if scrollable', function () {
      el.scrollTop    = 0;
      el.offsetHeight = 500;
      el.scrollHeight = 1000;
      // Check
      assert.isTrue(utils.isScrollable(el));
    });
  });

  describe('scrollToEnd', function () {
    it('Should bump down 1px when scrolled at top', function () {
      el.scrollTop    = 0;
      el.offsetHeight = 500;
      el.scrollHeight = 1000;
      // Check
      utils.scrollToEnd(el);
      assert.equal(el.scrollTop, 1);
    });
    it('Should bump up 1px when scrolled at bottom', function () {
      el.scrollTop    = 500;
      el.offsetHeight = 500;
      el.scrollHeight = 1000;
      // Check
      utils.scrollToEnd(el);
      assert.equal(el.scrollTop, 499);
    });
  });

});