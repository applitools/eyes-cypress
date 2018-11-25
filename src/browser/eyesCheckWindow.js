'use strict';
const getAllBlobs = require('./getAllBlobs');

function makeEyesCheckWindow({sendRequest, processPage, Blob}) {
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

    return processPage(doc).then(mainFrame => {
      const allBlobs = getAllBlobs(mainFrame);
      const {resourceUrls, blobData, frames, url, cdt} = replaceBlobsWithBlobDataInFrame(mainFrame);
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

  function replaceBlobsWithBlobDataInFrame({url, cdt, resourceUrls, blobs, frames}) {
    return {
      url,
      cdt,
      resourceUrls,
      blobData: blobs.map(mapBlobData),
      frames: frames.map(replaceBlobsWithBlobDataInFrame),
    };
  }

  function mapBlobData({url, type}) {
    return {url, type};
  }
}

module.exports = makeEyesCheckWindow;
