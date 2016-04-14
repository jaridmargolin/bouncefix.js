/*!
 * tests/lib/env.js
 */

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var sauceConnectLauncher = require('sauce-connect-launcher');
var webdriver = require('selenium-webdriver');
var Q = require('q');


/* -----------------------------------------------------------------------------
 * env
 * ---------------------------------------------------------------------------*/

module.exports = {

  /* ---------------------------------------------------------------------------
   * formatted device capabilities
   * -------------------------------------------------------------------------*/

  capabilities: {
    ios: {
      'browserName': 'Safari',
      'appiumVersion': '1.5.1',
      'deviceName': 'iPhone 6 Plus',
      'deviceOrientation': 'portrait',
      'platformVersion': '9.2',
      'platformName': 'iOS'
    }
  },


  /* ---------------------------------------------------------------------------
   * public api
   * -------------------------------------------------------------------------*/

  create: function (envName, serverType) {
    var tasks = [this.getDriver(this.capabilities[envName], serverType)];
    if (serverType === 'sauce') {
      tasks.push(this.connectToTunnel());
    }

    return Q.all(tasks);
  },

  destroy: function () {
    var tasks = [this.driver.quit()];
    if (this.tunnel) {
      tasks.push(this.tunnel.close());
    }

    return Q.all(tasks);
  },


  /* ---------------------------------------------------------------------------
   * helpers
   * -------------------------------------------------------------------------*/

  connectToTunnel: function () {
    return Q.nfcall(sauceConnectLauncher).then(function (tunnel) {
      this.tunnel = tunnel;
    }.bind(this));
  },

  getServer: function (serverType) {
    return {
      'sauce': this.getSauceServer.bind(this),
      'appium': this.getAppiumServer.bind(this)
    }[serverType]();
  },

  getSauceServer: function () {
    return Q.resolve('http://' + process.env.SAUCE_USERNAME + ':' +
      process.env.SAUCE_ACCESS_KEY + '@ondemand.saucelabs.com:80/wd/hub');
  },

  getAppiumServer: function () {
    // TODO: find open port and start appium process
    return Q.resolve('http://localhost:4723/wd/hub');
  },

  getDriver: function (capabilities, serverType) {
    return this.getServer(serverType).then(function (server) {
      return this.buildDriver(capabilities, server)
    }.bind(this));
  },

  buildDriver: function (capabilities, server) {
    return new webdriver.Builder()
      .usingServer(server)
      .withCapabilities(capabilities)
      .buildAsync()
      .then(function (driver) {
        this.driver = driver;
      }.bind(this));
  }

};