const EyesWrapper = require('./EyesWrapper');
const getAllResources = require('./getAllResources');
const getRenderStatus = require('./getRenderStatus');

async function openEyes({
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

    const resources = await getAllResources(resourceUrls, url);

    const renderWidth = viewportSize ? viewportSize.width : 1024; // TODO is viewportSize the right thing to use here? what if not defined?
    const renderId = await wrapper.postRender({
      url,
      resources,
      cdt,
      renderWidth,
      renderInfo,
    });
    const screenshotUrl = await getRenderStatus(renderId, wrapper);
    return await wrapper.checkWindow({screenshotUrl, tag});
  }

  async function close() {
    return await wrapper.close();
  }

  let renderInfo;

  await wrapper.open(appName, testName, viewportSize);

  return {
    checkWindow,
    close,
  };
}

module.exports = openEyes;
