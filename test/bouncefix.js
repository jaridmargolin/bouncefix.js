/*
 * test/bouncefix.js:
 *
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */ 

// 3rd party
var restore = require('sinon').restore,
    mock    = require('sinon').mock,
    stub    = require('sinon').stub;

var should  = require('chai').should(),
    assert  = require('chai').assert;

// first party
var EventListener = require('../src/eventlistener'),
    bouncefix     = require('../src/bouncefix'),
    Element       = require('./fake-element/element.js');


//
// bouncefix.js tests
//
describe('bouncefix.js', function () {

  // Fake element
  var el = new Element();

  // Stub _addObserver as it adds a MutationObserver which
  // is browser specific.
  stub(bouncefix.BounceFix.prototype, '_addObserver').returns({
    disconnect: function () {}
  });

  // New instance
  var fixed = bouncefix.add(el);

  it('Should set instance variables and init values', function () {
    // Instance vars
    assert.instanceOf(fixed.el, Element);
    assert.instanceOf(fixed.startListener, EventListener);
    assert.instanceOf(fixed.moveListener, EventListener);
    // Init value
    assert.isFalse(fixed.enabled);
  });

  it('Should enable if element is scrollable', function () {
    // Set element vals
    el.offsetHeight = 500;
    el.scrollHeight = 1000;
    // Manage state (In borwser triggered by MutationObserver)
    fixed._manageState();
    // Check
    assert.isTrue(fixed.enabled);
    assert.equal(el.listeners[0].evt, 'touchstart');
  });

  it('Should bump down 1px when scrolled at top', function () {
    // Scrollstart
    fixed.el.emit('touchstart');
    // Check
    assert.equal(fixed.el.scrollTop, 1);
  });

  it('Should bump up 1px when scrolled at bottom', function () {
    // Set element vals
    el.scrollTop = 500;
    // Scrollstart
    fixed.el.emit('touchstart');
    // Check
    assert.equal(fixed.el.scrollTop, 499);
  });

  it('Should disable if element is not scrollable', function () {
    // Set element vals
    el.offsetHeight = 500;
    el.scrollHeight = 500;
    el.scrollTop    = 0;
    // Manage state (In borwser triggered by MutationObserver)
    fixed._manageState();
    // Check
    assert.isFalse(fixed.enabled);
    assert.equal(el.listeners[0].evt, 'touchmove');
  });

  it('Should remove listeners/observers when remove called', function () {
    // Remove all listeners
    bouncefix.remove(el);
    // Check
    assert.lengthOf(fixed.el.listeners, 0);
  });

});