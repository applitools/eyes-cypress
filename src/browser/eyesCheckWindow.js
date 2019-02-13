'use strict';
const getAllBlobs = require('./getAllBlobs');

function makeEyesCheckWindow({sendRequest, processPage}) {
  return function eyesCheckWindow(doc, args) {
    let tag,
      sizeMode,
      selector,
      region,
      scriptHooks,
      ignore,
      floating,
      layout,
      strict,
      sendDom,
      debugCdt;
    if (typeof args === 'string') {
      tag = args;
    } else if (typeof args === 'object') {
      tag = args.tag;
      sizeMode = args.sizeMode;
      selector = args.selector;
      region = args.region;
      scriptHooks = args.scriptHooks;
      ignore = args.ignore;
      floating = args.floating;
      layout = args.layout;
      strict = args.strict;
      sendDom = args.sendDom;
      debugCdt = (args.debug && args.debug.cdt) || undefined;
    }

    return processPage(doc).then(mainFrame => {
      const allBlobs = getAllBlobs(mainFrame).map(mapBlob);
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
            floating,
            layout,
            strict,
            frames,
            sendDom,
            debugCdt,
          },
        }),
      );
    });
  };

  function putResource({url, value}) {
    return sendRequest({
      command: `resource/${encodeURIComponent(url)}`,
      data: value,
      method: 'PUT',
      headers: {'Content-Type': 'application/octet-stream'},
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
    return {url, type: type || 'application/x-applitools-unknown'};
  }

  function mapBlob({url, type, value}) {
    return {url, type: type || 'application/x-applitools-unknown', value};
  }
}

module.exports = makeEyesCheckWindow;
