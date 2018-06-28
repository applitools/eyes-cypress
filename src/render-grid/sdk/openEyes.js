const EyesWrapper = require('./EyesWrapper');
const getAllResources = require('./getAllResources');
const waitForRenderedStatus = require('./waitForRenderedStatus');
const {URL} = require('url');
const saveData = require('../troubleshoot/saveData');
const {setIsVerbose} = require('./log');
const createRenderRequests = require('./createRenderRequests');
const renderBatch = require('./renderBatch');

let batchInfo;

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
}) {
  setIsVerbose(showLogs);
  const renderPromises = [];

  async function checkWindow({resourceUrls, cdt, tag, sizeMode}) {
    async function checkWindowDo() {
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

      const screenshotUrls = await waitForRenderedStatus(renderIds, renderWrapper);

      if (!screenshotUrls) throw new Error(`no screenshots found for renderIds ${renderIds}`);

      return {screenshotUrls, tag};
    }
    const renderPromise = checkWindowDo();

    renderPromises.push(renderPromise);
  }

  async function close() {
    const results = [];

    for (const renderPromise of renderPromises) {
      const {screenshotUrls, tag} = await renderPromise;
      for (let i = 0, ii = screenshotUrls.length; i < ii; i++) {
        results.push(await wrappers[i].checkWindow({screenshotUrl: screenshotUrls[i], tag}));
      }
    }

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
  if (!batchInfo) {
    batchInfo = renderWrapper.getBatch();
  }
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

// for tests
openEyes.clearBatch = () => {
  batchInfo = null;
};

module.exports = openEyes;
