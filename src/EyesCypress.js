const extractDom = require('./extractDom');
const domNodesToCdt = require('./domNodesToCdt');
const finalizeResults = require('./finalizeResults');
const createRGridDom = require('./createRGridDom');

// NOTE: EyesCypressImpl is a class that extends EyesBase. I started with a function style, but if this looks weird then
// EyesCypressImpl will become EyesCypress and we'll incorporate the functionality below into the class
const EyesCypressImpl = require('./EyesCypressImpl');

async function EyesCypress(appName, testName, cy, config) {
  async function checkWindow(url, windowWidth) {
    counter++;
    const doc = await cy.document();
    const domNodes = extractDom(doc);
    const cdt = domNodesToCdt(domNodes);

    const rGridDom = await createRGridDom(domNodes, cdt);
    const renderId = await eyesImpl.renderWindow(
      url,
      rGridDom,
      windowWidth,
      eyesImpl.getRenderInfo(),
    );
    renderIds.push(renderId);

    if (renderIds.length === 1 && !isCheckWindowScheduled) {
      // TODO trigger matchWindow loop (if not already scheduled?)
      checkWindowLoop();
    }
  }

  async function close() {
    if (results.length === counter) {
      await finalizeResults(results);
    } else {
      console.log(
        'not all results are in yet (rendering is still in progress). waiting a bit before trying again..',
      );
      setTimeout(close, 300);
    }
  }

  async function checkWindowLoop() {
    // TODO update results array on promise resolves

    isCheckWindowScheduled = true;
    for (const renderId of renderIds) {
      const result = eyesImpl.checkWindow(renderId);
      results.push(result);
    }
  }

  function finalizeResults() {
    // TODO Promise.all on results, then close session
    // TODO print something and fail on errors
    return Promise.all(results).then(() => {
      eyesImpl.close();
    });
  }

  let counter = 0;
  let renderIds = [];
  let results = [];
  let isCheckWindowScheduled = false;
  const eyesImpl = new EyesCypressImpl(config);
  await eyesImpl.open(appName, testName, config.viewportSize);

  return {
    close,
    checkWindow,
  };
}

module.exports = EyesCypress;

/*

  open:
  1. open session (use eye.sdk.core?)


  checkWindow:
  url => [hash, buffer, content-type]

  sync:
  0. increment COUNTER
  1. extract DOM
  2. translate to CDT-HTML format

  background:
  3. find all resource urls in DOM
  4. fetch all resources
  5. compute hash of all resources
  6. /render
  7*. [PUT,...]
  8*. /render --> renderId
  9. enqueue renderId (optionally trigger (10) if the renderStatus array is empty)

  really background:
  10. loop through renderIds and request renderStatus ==> locations
  11. call matchWindow on completed renderIds




  close:
  1. poll matchWindow results array length to be COUNTER
  2. when array is of length COUNTER, Promise.all on it
  3. close session 
  4. print something and fail on errors
  
  */
