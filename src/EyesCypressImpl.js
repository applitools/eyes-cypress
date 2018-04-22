const {
  EyesBase,
  RectangleSize,
  EyesSimpleScreenshot,
  NullRegionProvider,
  CheckSettings,
} = require('@applitools/eyes.sdk.core');

const {
  BatchInfo,
  RGridResource,
  RGridDom,
  ConsoleLogHandler,
  GeneralUtils,
} = require('@applitools/eyes.sdk.core');

const VERSION = require('../package.json').version;

class EyesCypressImpl extends EyesBase {
  constructor(config = {}) {
    super();
    this.setApiKey(config.apiKey);
    this.setLogHandler(new ConsoleLogHandler(true));
  }

  async open(appName, testName, viewportSize) {
    await super.openBase(appName, testName);
    this._viewportSizeHandler.set(new RectangleSize(viewportSize));
  }

  /** @override */
  getBaseAgentId() {
    return `eyes.cypress/${VERSION}`;
  }

  /**
   * Get the AUT session id.
   *
   * @return {Promise<?String>}
   */
  getAUTSessionId() {
    return this.getPromiseFactory().resolve(undefined);
  }

  async getRenderInfo() {
    return await this._serverConnector.renderInfo();
  }

  /**
   * Create a screenshot of a page on RenderingGrid server
   *
   * @param {String} url The url of the page to be rendered
   * @param {RGridDom} rGridDom The DOM of a page with resources
   * @param {number} [renderWidth]
   * @param {RenderingInfo} [renderingInfo]
   * @return {Promise.<String>} The results of the render
   */
  async renderWindow(url, rGridDom, renderWidth, renderingInfo) {
    this._serverConnector.setRenderingAuthToken(renderingInfo.getAccessToken());
    this._serverConnector.setRenderingServerUrl(renderingInfo.getServiceUrl());
    return await this._renderWindowTask.renderWindow(
      renderingInfo.getResultsUrl(),
      url,
      rGridDom,
      renderWidth,
    );
  }

  async checkWindow(imgUrl) {
    const regionProvider = new NullRegionProvider(this.getPromiseFactory());
    const checkSettings = new CheckSettings(0);
    this.screenshotUrl = imgUrl;
    return await this.checkWindowBase(regionProvider, '', false, checkSettings);
  }

  async getScreenshot() {
    return await undefined; // TODO verify promise?
  }

  async getScreenshotUrl() {
    return await this.screenshotUrl; // TODO verify promise?
  }

  async getInferredEnvironment() {
    return await '';
  }

  async getTitle() {
    return await 'some title';
  }
}

module.exports = EyesCypressImpl;
