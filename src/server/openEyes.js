const {URL} = require('url');
const EyesWrapper = require('./EyesWrapper');
const fetchResources = require('./fetchResources');

function openEyes({
  appName,
  testName,
  viewportSize,
  url,
  apiKey,
  wrapper = new EyesWrapper({apiKey}),
}) {
  async function checkWindow({resourceUrls, cdt, tag}) {
    if (!renderInfo) {
      renderInfo = await wrapper.getRenderInfo();
    }

    const absoluteUrls = resourceUrls.map(resourceUrl => new URL(resourceUrl, url).href);
    const resources = await fetchResources(absoluteUrls);
    const renderWidth = viewportSize ? viewportSize.width : 1024; // TODO is viewportSize the right thing to use here? what if not defined?
    const screenshotUrl = await wrapper.renderWindow({
      url,
      resources,
      cdt,
      renderWidth,
      renderInfo,
    });
    return await wrapper.checkWindow({screenshotUrl, tag});
  }

  async function close() {
    return await wrapper.close();
  }

  wrapper.open(appName, testName, viewportSize);

  let renderInfo;
  return {
    checkWindow,
    close,
  };
}

module.exports = openEyes;
