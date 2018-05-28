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
  const checkWindowPromises = [];

  async function checkWindow({resourceUrls, cdt, tag}) {
    async function checkWindowDo() {
      if (!renderInfo) {
        renderInfo = await wrapper.getRenderInfo();
      }

      const absoluteUrls =
        resourceUrls && resourceUrls.map(resourceUrl => new URL(resourceUrl, url).href);
      const resources = await getAllResources(absoluteUrls);

      const renderId = await wrapper.postRender({
        url,
        resources,
        tag,
        cdt,
        viewportSize,
        renderInfo,
      });

      // TODO troubleshoot flag
      // await saveData({renderId, cdt, resources, url});

      const screenshotUrl = await getRenderStatus(renderId, wrapper);
      return await wrapper.checkWindow({screenshotUrl, tag});
    }
    const checkWindowPromise = checkWindowDo();

    checkWindowPromises.push(checkWindowPromise);
  }

  async function close() {
    const results = await Promise.all(checkWindowPromises);

    await wrapper.close();

    return results;
  }

  let renderInfo;

  await wrapper.open(appName, testName, viewportSize);

  return {
    checkWindow,
    close,
  };
}

module.exports = openEyes;
