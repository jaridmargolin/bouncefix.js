/*!
 * test/bouncefix.js
 */


define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var assert = require('proclaim');
var sinon = require('sinon');
var bouncefix = require('bouncefix');
var DOMEvent = require('dom-event/dom-event');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('bouncefix.js', function () {


  /* ---------------------------------------------------------------------------
   * initialize
   * -------------------------------------------------------------------------*/

  // temporary hack because phantomjs doesn't support matches which breaks
  // our headless unit tests.
  before(function () {
    if (!Element.prototype.matches) {
      Element.prototype.matches = function () {};
    }
  });

  describe('initialize', function () {

    it('Should initialize with no passed selectors.', function () {
      bouncefix.initialize();
    });

    it('Should add selectors if passed.', function () {
      bouncefix.initialize('.test');

      assert.isTrue(bouncefix.selectors['.test']);
    });

    it('Should add touchstart and touchend listeners.', function () {
      bouncefix.initialize('.test');

      assert.isInstanceOf(bouncefix.listeners['touchstart'], DOMEvent);
      assert.isInstanceOf(bouncefix.listeners['touchstart'], DOMEvent);
    });

    it('Should prevent listeners from being added multiple times.', function () {
      bouncefix.initialize('.test');

      var touchStartListener = bouncefix.listeners['touchstart'];
      var touchEndListener = bouncefix.listeners['touchend'];

      bouncefix.initialize('.test2');

      assert.equal(touchStartListener, bouncefix.listeners['touchstart']);
      assert.equal(touchEndListener, bouncefix.listeners['touchend']);
    });

  });


  /* ---------------------------------------------------------------------------
   * teardown
   * -------------------------------------------------------------------------*/

  describe('teardown', function () {

    it('Should remove all selectors.', function () {
      bouncefix.initialize('.test');
      bouncefix.teardown();

      assert.deepEqual(bouncefix.selectors, {});
    });

    it('Should remove all listeners.', function () {
      bouncefix.initialize('.test');
      bouncefix.teardown();

      assert.deepEqual(bouncefix.listeners, {});
    });

  });


  /* ---------------------------------------------------------------------------
   * add
   * -------------------------------------------------------------------------*/

  describe('add', function () {

    beforeEach(function () {
      bouncefix.teardown();
    });

    it('Should add single selector.', function () {
      bouncefix.add('.test');

      assert.deepEqual(bouncefix.selectors, { '.test': true });
    });

    it('Should add multiple selectors.', function () {
      bouncefix.add('.test, .2');

      assert.deepEqual(bouncefix.selectors, { '.test': true, '.2': true });
    });

  });


  /* ---------------------------------------------------------------------------
   * remove
   * -------------------------------------------------------------------------*/

  describe('remove', function () {

    beforeEach(function () {
      bouncefix.teardown();
    });

    it('Should remove single selector.', function () {
      bouncefix.add('.test, .2');
      bouncefix.remove('.test');

      assert.deepEqual(bouncefix.selectors, { '.2': true });
    });

    it('Should remove multiple selectors.', function () {
      bouncefix.add('.test, .2');
      bouncefix.remove('.test, .2');

      assert.deepEqual(bouncefix.selectors, {});
    });

    it('Should remove all selectors.', function () {
      bouncefix.add('.test, .2');
      bouncefix.remove();

      assert.deepEqual(bouncefix.selectors, {});
    });

  });

});


});