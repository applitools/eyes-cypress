const {URL} = require('url');
const EyesWrapper = require('./EyesWrapper');
const fetchResources = require('./fetchResources');
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

    const resources = await organizeResources(allResources, resourceUrls);

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

  function log(msg) {
    wrapper._logger.verbose(msg);
  }

  // TODO move to other file
  async function organizeResources(allResources, resourceUrls) {
    const absoluteUrls = resourceUrls.map(resourceUrl => new URL(resourceUrl, url).href);
    const missingResourceUrls = absoluteUrls.filter(resourceUrl => !allResources[resourceUrl]);
    log(`fetching missing resources: ${missingResourceUrls}`);
    const fetchedResources = await fetchResources(missingResourceUrls);
    Object.assign(allResources, fetchedResources); // add to cache

    const resources = {};
    for (url of absoluteUrls) {
      resources[url] = allResources[url];
    }

    return resources;
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

  let renderInfo,
    allResources = {};
  return {
    checkWindow,
    close,
  };
}

module.exports = openEyes;
