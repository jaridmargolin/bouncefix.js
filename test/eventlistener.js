/*
 * test/eventlistener.js:
 *
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */ 

// 3rd party
var should  = require('chai').should(),
    assert  = require('chai').assert;

// first party
var EventListener = require('../src/eventlistener'),
    Element       = require('./fake/element.js');


//
// eventlistener.js tests
//
describe('eventlistener.js', function () {

  // Fake element
  var el = new Element();

  // Create a dummy class which will hold handler
  // Used to test context
  function Dummy(val) {
    this.prop = val;
  }
  // Handler checks if correct context
  Dummy.prototype.handler = function (evt) {
    assert.equal(this.prop, 'value');
  };
  
  // New dummy isntance
  var dummy = new Dummy('value');

  // New EventListener instance
  var listener = new EventListener(el, {
    evt: 'test',
    handler: dummy.handler,
    context: dummy
  });

  it('Should setup listener instance correctly', function () {
    // Check
    assert.equal(listener.evt, 'test');
    assert.isFunction(listener.handler);
  });

  it('Should add listeners with add method', function () {
    // Add listener to element
    listener.add();
    // Check
    assert.equal(el.listeners[0].evt, 'test');
    assert.isFunction(el.listeners[0].handler);
  });

  it('Should call handler with the correct context', function () {
    // Add to element and emit
    el.emit('test');
  });

  it('Should remove listeners with remove method', function () {
    // Remove listener from element
    listener.remove();
    // Check that it was removed
    assert.lengthOf(el.listeners, 0);
  });
  
});