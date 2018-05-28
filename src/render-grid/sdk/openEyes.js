const EyesWrapper = require('./EyesWrapper');
const getAllResources = require('./getAllResources');
const getRenderStatus = require('./getRenderStatus');
const {URL} = require('url');
// const saveData = require('../troubleshoot/saveData');

async function openEyes({
  appName,
  testName,
  viewportSize = {width: 1024, height: 768},
  url,
  apiKey,
  isVerbose = false,
  wrapper = new EyesWrapper({apiKey, isVerbose}),
}) {
  async function checkWindow({resourceUrls, cdt, tag}) {
    if (!renderInfo) {
      renderInfo = await wrapper.getRenderInfo();
    }

    const absoluteUrls =
      resourceUrls && resourceUrls.map(resourceUrl => new URL(resourceUrl, url).href);
    const resources = await getAllResources(absoluteUrls);

    const renderId = await wrapper.postRender({
      url,
      resources,
      cdt,
      viewportSize,
      renderInfo,
    });

    // TODO troubleshoot flag
    // await saveData({renderId, cdt, resources, url});

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
