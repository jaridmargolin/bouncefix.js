/*!
 * test/launch.js
 */

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var webdriver = require('selenium-webdriver');
var Q = require('q');
var env = require('./lib/env');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('bouncefix.js', function () {

  this.timeout(100000 * 3);

  before(function () {
    return env.create('ios', 'appium');
  });

  beforeEach(function () {
    return env.driver.get('http://0.0.0.0:9999/tests/index.html');
  });

  after(function () {
    return env.destroy();
  });

  it('Should block body scroll when scroll occurs on non scrollable el.', function () {

  });

  it('Should block body scroll when scroll occurs on scrollable el at a boundary.', function () {

  });

});