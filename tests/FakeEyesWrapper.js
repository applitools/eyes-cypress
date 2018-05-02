const {MatchResult, RenderStatusResults, RenderStatus} = require('@applitools/eyes.sdk.core');

const expectedCdt = JSON.parse(JSON.stringify(require('./fixtures/test.cdt.json')));
const BAD_SCREENSHOT_URL = 'BAD_SCREENSHOT_URL';
const GOOD_SCREENSHOT_URL = 'GOOD_SCREENSHOT_URL';
const BAD_RENDER_ID = 'BAD_RENDER_ID';
const GOOD_RENDER_ID = 'GOOD_RENDER_ID';

function compare(o1, o2) {
  return JSON.stringify(o1) === JSON.stringify(o2);
}

module.exports = {
  async open(_appName, _testName, _viewportSize) {},
  async postRender({
    url: _url,
    resources: _resources,
    cdt,
    renderWidth: _renderWidth,
    renderInfo: _renderInfo,
  }) {
    const isGood = !cdt || compare(cdt, expectedCdt);
    return isGood ? GOOD_RENDER_ID : BAD_RENDER_ID;
  },
  async getRenderStatus(renderId) {
    const result = new RenderStatusResults();
    result.setStatus(RenderStatus.RENDERED);
    result.setImageLocation(renderId === GOOD_RENDER_ID ? GOOD_SCREENSHOT_URL : BAD_SCREENSHOT_URL);
    return result;
  },
  async getRenderInfo() {},
  async checkWindow({screenshotUrl, tag: _tag}) {
    const result = new MatchResult();
    const asExpected = screenshotUrl === GOOD_SCREENSHOT_URL;
    result.setAsExpected(asExpected);
    return result;
  },
  createRGridDom({cdt: _cdt, resources: _resources}) {},
  async close() {},
  _logger: {
    verbose: console.log,
  },
};
