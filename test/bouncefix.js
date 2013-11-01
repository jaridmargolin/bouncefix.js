/*
 * test/bouncefix.js:
 *
 * (C) 2013 Jarid Margolin
 * MIT LICENCE
 *
 */ 

// 3rd party
var sinon   = require('sinon'),
    stub    = require('sinon').stub;

var should  = require('chai').should(),
    assert  = require('chai').assert;

// first party
var EventListener = require('../src/eventlistener'),
    bouncefix     = require('../src/bouncefix'),
    Element       = require('./fake/element.js');


//
// bouncefix.js tests
//
describe('bouncefix.js', function () {

  // Monkey Patch Fix for tests
  bouncefix.Fix = function () {
    this.remove = function () {};
  };

  it('Should add classes to cache', function () {
    bouncefix.add('test');
    bouncefix.add('test2');
    assert.isObject(bouncefix.cache['test']);
    assert.isObject(bouncefix.cache['test2']);
  });

  it('Should remove classes from cache', function () {
    bouncefix.remove('test');
    bouncefix.remove('test2');
    assert.isUndefined(bouncefix.cache['test']);
    assert.isUndefined(bouncefix.cache['test2']);
  });

});