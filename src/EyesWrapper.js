const {
  EyesBase,
  RectangleSize,
  NullRegionProvider,
  CheckSettings,
  ConsoleLogHandler,
} = require('@applitools/eyes.sdk.core');

const VERSION = require('../package.json').version;

class EyesCypressImpl extends EyesBase {
  constructor(config = {}) {
    super();
    this.setApiKey(config.apiKey);
    this.setLogHandler(new ConsoleLogHandler(true)); // TODO open to configuration / based on env
  }

  async open(appName, testName, viewportSize) {
    await super.openBase(appName, testName);
    this._viewportSizeHandler.set(new RectangleSize(viewportSize)); // Not doing this causes an exception at a later
  }

  /** @override */
  getBaseAgentId() {
    return `eyes.cypress/${VERSION}`; // TODO is this good?
  }

  /**
   * Get the AUT session id.
   *
   * @return {Promise<?String>}
   */
  getAUTSessionId() {
    return this.getPromiseFactory().resolve(undefined); // TODO is this good?
  }

  /**
   * Get a RenderingInfo from eyes server
   *
   * @return {Promise.<RenderingInfo>}
   */
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
  async renderWindow(url, rGridDom, renderWidth, renderInfo) {
    this._serverConnector.setRenderingAuthToken(renderInfo.getAccessToken());
    this._serverConnector.setRenderingServerUrl(renderInfo.getServiceUrl());
    return await this._renderWindowTask.renderWindow(
      renderInfo.getResultsUrl(),
      url,
      rGridDom,
      renderWidth,
    );
  }

  async checkWindow(screenshotUrl, tag) {
    const regionProvider = new NullRegionProvider(this.getPromiseFactory()); // TODO receive from outside?
    const checkSettings = new CheckSettings(0); // TODO receieve from outside?
    this.screenshotUrl = screenshotUrl;
    return await this.checkWindowBase(regionProvider, tag, false, checkSettings);
  }

  async getScreenshot() {
    return await undefined; // TODO will I ever need this?
  }

  async getScreenshotUrl() {
    return await this.screenshotUrl;
  }

  async getInferredEnvironment() {
    return await ''; // TODO what does this mean? should there be something meaningful here?
  }

  async getTitle() {
    return await 'some title'; // TODO what should this be? is it connected with the tag in `checkWindow` somehow?
  }
}

module.exports = EyesCypressImpl;
