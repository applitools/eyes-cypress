const EyesWrapper = require('./EyesWrapper');
const getAllResources = require('./getAllResources');
const {RenderStatus, GeneralUtils} = require('@applitools/eyes.sdk.core');

const GET_STATUS_INTERVAL = 500; // TODO take from SDK?
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

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

    const resources = await getAllResources(resourceUrls, url);

    const renderWidth = viewportSize ? viewportSize.width : 1024; // TODO is viewportSize the right thing to use here? what if not defined?
    const renderId = await wrapper.postRender({
      url,
      resources,
      cdt,
      renderWidth,
      renderInfo,
    });
    const screenshotUrl = await getRenderStatus(renderId);
    return await wrapper.checkWindow({screenshotUrl, tag});
  }

  async function close() {
    return await wrapper.close();
  }

  // TODO move to other file
  async function getRenderStatus(renderId) {
    try {
      const renderStatus = await wrapper.getRenderStatus(renderId);
      const status = renderStatus.getStatus();
      if (status === RenderStatus.RENDERING) {
        await sleep(GET_STATUS_INTERVAL);
        return getRenderStatus(renderId);
      } else if (status === RenderStatus.ERROR) {
        throw renderStatus.getError();
      }
      return renderStatus.getImageLocation();
    } catch (ex) {
      // TODO number of retries?
      await sleep(GET_STATUS_INTERVAL); // TODO use GeneralUtils from SDK?
      return getRenderStatus(renderId);
    }
  }

  wrapper.open(appName, testName, viewportSize);

  let renderInfo;
  return {
    checkWindow,
    close,
  };
}

module.exports = openEyes;
