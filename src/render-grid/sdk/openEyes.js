const EyesWrapper = require('./EyesWrapper');
const getAllResources = require('./getAllResources');
const waitForRenderedStatus = require('./waitForRenderedStatus');
const {URL} = require('url');
const saveData = require('../troubleshoot/saveData');
const {setIsVerbose} = require('./log');
const createRenderRequests = require('./createRenderRequests');
const renderBatch = require('./renderBatch');
const {BatchInfo} = require('@applitools/eyes.sdk.core');

// TODO replace with getInferredEnvironment once render service returns userAgent
const getHostAppFromBrowserName = browserName =>
  browserName.charAt(0).toUpperCase() + browserName.slice(1);

async function openEyes({
  appName,
  testName,
  browser = {width: 1024, height: 768},
  url,
  apiKey,
  showLogs = false,
  saveDebugData = false,
  wrappers,
  batchName,
  batchId,
}) {
  async function checkWindow({resourceUrls, cdt, tag, sizeMode}) {
    async function checkWindowJob(renderPromise, prevJobPromise, index) {
      const renderId = (await renderPromise)[index];
      const [screenshotUrl] = await waitForRenderedStatus([renderId], renderWrapper);
      await prevJobPromise;
      results.push(await wrappers[index].checkWindow({screenshotUrl, tag}));
    }

    async function startRender() {
      const renderInfo = await renderInfoPromise;

      const absoluteUrls =
        resourceUrls && resourceUrls.map(resourceUrl => new URL(resourceUrl, url).href);
      const resources = await getAllResources(absoluteUrls);

      const renderRequests = createRenderRequests({
        url,
        resources,
        cdt,
        browsers,
        renderInfo,
        sizeMode,
      });
      const renderIds = await renderBatch(renderRequests, renderWrapper);

      if (saveDebugData) {
        for (const renderId of renderIds) {
          await saveData({renderId, cdt, resources, url});
        }
      }

      return renderIds;
    }

    /******* checkWindow body start *******/

    const renderPromise = startRender();
    checkWindowPromises = browsers.map((_browser, i) =>
      checkWindowJob(renderPromise, checkWindowPromises[i], i),
    );
  }

  async function close() {
    await Promise.all(checkWindowPromises);
    await Promise.all(wrappers.map(wrapper => wrapper.close()));
    return results;
  }

  async function initWrappers() {
    wrappers = [];
    for (const browser of browsers) {
      const wrapper = new EyesWrapper({apiKey, isVerbose: showLogs});
      await wrapper.open(
        appName,
        testName,
        {width: browser.width, height: browser.height},
        browser.name && getHostAppFromBrowserName(browser.name), // TODO replace with getInferredEnvironment once render service returns userAgent
      );
      wrappers.push(wrapper);
    }
  }

  /******* openEyes body start *******/

  setIsVerbose(showLogs);
  let checkWindowPromises = [];
  const results = [];

  if (!apiKey) {
    throw new Error(
      'APPLITOOLS_API_KEY env variable is not defined. It is required to define this variable when running Cypress for Applitools visual tests to run successfully.',
    );
  }

  const browsers = Array.isArray(browser) ? browser : [browser];
  if (!wrappers) {
    await initWrappers();
  }

  const renderWrapper = wrappers[0];

  const batchInfo = new BatchInfo(batchName, null, batchId);

  for (const wrapper of wrappers) {
    wrapper.setBatch(batchInfo);
  }

  const renderInfoPromise = renderWrapper.getRenderInfo().then(renderInfo => {
    renderWrapper.setRenderingInfo(renderInfo);
    return renderInfo;
  });

  return {
    checkWindow,
    close,
  };
}

module.exports = openEyes;
