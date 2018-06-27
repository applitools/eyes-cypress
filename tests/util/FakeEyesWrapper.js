const {MatchResult, RenderStatusResults, RenderStatus} = require('@applitools/eyes.sdk.core');
const {URL} = require('url');
const {loadJsonFixture, loadFixtureBuffer} = require('./loadFixture');
const BAD_SCREENSHOT_URL = 'BAD_SCREENSHOT_URL';
const GOOD_SCREENSHOT_URL = 'GOOD_SCREENSHOT_URL';
const BAD_RENDER_ID = 'BAD_RENDER_ID';
const GOOD_RENDER_ID = 'GOOD_RENDER_ID';
const SOME_BATCH = 'SOME_BATCH';
const crypto = require('crypto');
const FakeRunningRender = require('./FakeRunningRender');

function compare(o1, o2) {
  return JSON.stringify(o1) === JSON.stringify(o2);
}

function getSha256Hash(content) {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');
}

function addSizeMode(str, sizeMode) {
  return `${str}_sizeMode:${sizeMode}`;
}

function getSizeMode(str) {
  return str.match(/_sizeMode:(.+)$/)[1];
}

class FakeEyesWrapper {
  constructor({goodFilename, goodResourceUrls, goodTags}) {
    this._logger = {
      verbose: console.log,
      log: console.log,
    };
    this.goodFilename = goodFilename;
    this.goodResourceUrls = goodResourceUrls;
    this.goodTags = goodTags;
    this.batch;
  }

  async open(_appName, _testName, _viewportSize) {}

  async renderBatch(renderRequests) {
    return renderRequests.map(renderRequest => this.getRunningRenderForRequest(renderRequest));
  }

  getRunningRenderForRequest(renderRequest) {
    const resources = renderRequest.getResources();
    const actualResources = resources.map(resource => ({
      url: resource.getUrl(),
      hash: resource.getSha256Hash(),
    }));
    const isGoodResources =
      !actualResources.length ||
      this.expectedResources.every(er => !!actualResources.find(ar => compare(er, ar)));

    const cdt = renderRequest.getDom().getDomNodes();
    const isGoodCdt = cdt.length === 0 || compare(cdt, this.expectedCdt); // allowing [] for easier testing (only need to pass `cdt:[]` in the test)
    const sizeMode = renderRequest.getRenderInfo().getSizeMode();

    const isGood = isGoodCdt && isGoodResources;
    const renderId = isGood ? GOOD_RENDER_ID : BAD_RENDER_ID;
    const renderIdWithSizeMode = addSizeMode(renderId, sizeMode);

    return new FakeRunningRender(renderIdWithSizeMode, RenderStatus.RENDERED);
  }

  async getRenderStatus(renderIds) {
    return renderIds.map(renderId => {
      const sizeMode = getSizeMode(renderId);
      const result = new RenderStatusResults();
      result.setStatus(RenderStatus.RENDERED);
      const imageLocation = renderId.match(GOOD_RENDER_ID)
        ? GOOD_SCREENSHOT_URL
        : BAD_SCREENSHOT_URL;
      const imageLocationWithSizeMode = addSizeMode(imageLocation, sizeMode);
      result.setImageLocation(imageLocationWithSizeMode);
      return result;
    });
  }

  async getRenderInfo() {
    return {getResultsUrl: () => 'some webhook'};
  }

  setRenderingInfo() {}

  async checkWindow({screenshotUrl, tag, sizeMode = 'full-page'}) {
    if (this.goodTags && !this.goodTags.includes(tag))
      throw new Error(`Tag ${tag} should be one of the good tags ${this.goodTags}`);

    const result = new MatchResult();
    const goodScreenshot = !!screenshotUrl.match(GOOD_SCREENSHOT_URL);
    const screenshotSizeMode = getSizeMode(screenshotUrl);
    const asExpected = goodScreenshot && screenshotSizeMode === sizeMode;
    result.setAsExpected(asExpected);
    return result;
  }

  createRGridDom({cdt: _cdt, resources: _resources}) {}

  async close() {}

  get expectedCdt() {
    return loadJsonFixture(this.goodFilename);
  }

  get expectedResources() {
    return this.goodResourceUrls.map(resourceUrl => ({
      url: resourceUrl,
      hash: getSha256Hash(loadFixtureBuffer(new URL(resourceUrl).pathname.slice(1))),
    }));
  }

  getBatch() {
    return this.batch || SOME_BATCH;
  }

  setBatch(batch) {
    this.batch = batch;
  }
}

module.exports = FakeEyesWrapper;
