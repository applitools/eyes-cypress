'use strict';

function makeEyesCheckWindow({sendRequest, processDocument, Blob}) {
  return function eyesCheckWindow(doc, args) {
    let tag, sizeMode, selector, region, scriptHooks, ignore, sendDom;
    if (typeof args === 'string') {
      tag = args;
    } else if (typeof args === 'object') {
      tag = args.tag;
      sizeMode = args.sizeMode;
      selector = args.selector;
      region = args.region;
      scriptHooks = args.scriptHooks;
      ignore = args.ignore;
      sendDom = args.sendDom;
    }

    return processDocument(doc).then(({resourceUrls, blobs, frames, url, cdt, allBlobs}) => {
      const blobData = blobs.map(({url, type}) => ({url, type}));
      return Promise.all(allBlobs.map(putResource)).then(() =>
        sendRequest({
          command: 'checkWindow',
          data: {
            url,
            resourceUrls,
            cdt,
            tag,
            sizeMode,
            blobData,
            selector,
            region,
            scriptHooks,
            ignore,
            frames,
            sendDom,
          },
        }),
      );
    });
  };

  function putResource({url, type, value}) {
    return sendRequest({
      command: `resource/${encodeURIComponent(url)}`,
      data: new Blob([value]),
      method: 'PUT',
      headers: {'Content-Type': type},
    });
  }
}

module.exports = makeEyesCheckWindow;
