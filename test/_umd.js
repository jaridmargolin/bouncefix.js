/*!
 * test/_umd.js
 */


define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var assert = require('proclaim');
var bouncefix = require('bouncefix/bouncefix');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('umd - bouncefix.js', function () {

  it('Should expose public methods.', function () {
    assert.isFunction(bouncefix.initialize);
    assert.isFunction(bouncefix.add);
    assert.isFunction(bouncefix.remove);
    assert.isFunction(bouncefix.teardown);
  });

});


});