const {URL} = require('url');
const EyesWrapper = require('./EyesWrapper');
const fetchResources = require('./fetchResources');

// TODO what're all the options in config?

function EyesRunner(config) {
  async function checkWindow(resourceUrls, cdt, tag) {
    if (!renderInfo) {
      renderInfo = await eyesWrapper.getRenderInfo();
    }

    const absoluteUrls = resourceUrls.map(resourceUrl => new URL(resourceUrl, url).href);
    const resources = await fetchResources(absoluteUrls);
    const rGridDom = await eyesWrapper.createRGridDom({resources, cdt});
    const screenshotUrl = await eyesWrapper.renderWindow(
      url,
      rGridDom,
      viewportSize ? viewportSize.width : 1024, // TODO is viewportSize the right thing to use here? what if not defined?
      renderInfo,
    );
    return await eyesWrapper.checkWindow(screenshotUrl, tag);
  }

  async function close() {
    return await eyesWrapper.close();
  }

  const {appName, testName, viewportSize, url, apiKey, wrapper} = config;
  const eyesWrapper = wrapper || new EyesWrapper({apiKey});

  eyesWrapper.open(appName, testName, config.viewportSize);

  let renderInfo;
  return {
    checkWindow,
    close,
  };
}

module.exports = EyesRunner;
