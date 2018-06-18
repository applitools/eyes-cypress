const EyesWrapper = require('./EyesWrapper');
const getAllResources = require('./getAllResources');
const waitForRenderedStatus = require('./waitForRenderedStatus');
const {URL} = require('url');
const saveData = require('../troubleshoot/saveData');
const {setIsVerbose} = require('./log');
const createRenderRequests = require('./createRenderRequests');

let batchInfo;

async function openEyes({
  appName,
  testName,
  viewportSize = {width: 1024, height: 768},
  url,
  apiKey,
  isVerbose = false,
  saveDebugData = false,
  wrappers,
}) {
  setIsVerbose(isVerbose);
  const renderPromises = [];

  async function checkWindow({resourceUrls, cdt, tag}) {
    async function checkWindowDo() {
      const renderInfo = await renderInfoPromise;

      const absoluteUrls =
        resourceUrls && resourceUrls.map(resourceUrl => new URL(resourceUrl, url).href);
      const resources = await getAllResources(absoluteUrls);

      const renderRequests = createRenderRequests({
        url,
        resources,
        cdt,
        viewportSizes,
        renderInfo,
      });
      const renderIds = await renderWrapper.renderBatch(renderRequests);

      if (saveDebugData) {
        for (const renderId of renderIds) {
          await saveData({renderId, cdt, resources, url});
        }
      }

      const screenshotUrls = await waitForRenderedStatus(renderIds, renderWrapper);

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
    for (const viewportSize of viewportSizes) {
      const wrapper = new EyesWrapper({apiKey, isVerbose});
      await wrapper.open(appName, testName, viewportSize);
      wrappers.push(wrapper);
    }
  }

  const viewportSizes = Array.isArray(viewportSize) ? viewportSize : [viewportSize];
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
