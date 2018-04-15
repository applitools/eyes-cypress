const extractDom = require('./extractDom');
const domToCdt = require('./domToCdt');
const renderDom = require('./renderDom');
const finalizeResults = require('./finalizeResults');

function EyesCypress(cy) {
  let counter = 0;
  let renderIds = [];
  let results = [];

  const checkWindow = async () => {
    counter++;
    const doc = await cy.document();
    const dom = extractDom(doc);
    const cdt = domToCdt(dom);

    renderDom(dom, renderIds).then(renderId => {
      renderIds.push(renderId);
    });
  };

  const close = async () => {
    if (results.length === counter) {
      finalizeResults(results);
    } else {
      setTimeout(close, 300);
    }
  };

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
