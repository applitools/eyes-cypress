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

    const resources = await organizeResources(allResources, resourceUrls);

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

  function log(msg) {
    wrapper._logger.verbose(msg);
  }

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

  wrapper.open(appName, testName, viewportSize);

  let renderInfo,
    allResources = {};
  return {
    checkWindow,
    close,
  };
}

module.exports = openEyes;
