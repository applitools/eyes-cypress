const fs = require('fs');
const path = require('path');
const {MatchResult} = require('@applitools/eyes.sdk.core');

const expectedCdt = JSON.parse(JSON.stringify(require('./fixtures/test.cdt.json')));
const BAD_SCREENSHOT_URL = 'BAD';
const GOOD_SCREENSHOT_URL = 'GOOD';

function compare(o1, o2) {
  return JSON.stringify(o1) === JSON.stringify(o2);
}

module.exports = {
  async open(appName, testName, viewportSize) {},
  async renderWindow({url, resources, cdt, renderWidth, renderInfo}) {
    const isGood = !cdt || compare(cdt, expectedCdt);
    return isGood ? GOOD_SCREENSHOT_URL : BAD_SCREENSHOT_URL;
  },
  async getRenderInfo() {},
  async checkWindow({screenshotUrl, tag}) {
    const result = new MatchResult();
    const asExpected = screenshotUrl === GOOD_SCREENSHOT_URL;
    result.setAsExpected(asExpected);
    return result;
  },
  createRGridDom({cdt, resources}) {},
  async close() {},
  _logger: {
    verbose: console.log,
  },
};
