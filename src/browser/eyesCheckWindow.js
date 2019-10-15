/* global window */
'use strict';
const getAllBlobs = require('./getAllBlobs');

function makeEyesCheckWindow({sendRequest, processPage, win = window}) {
  return function eyesCheckWindow(doc, args) {
    let tag,
      sizeMode,
      target,
      fully,
      selector,
      region,
      scriptHooks,
      ignore,
      floating,
      layout,
      content,
      strict,
      sendDom,
      useDom,
      enablePatterns,
      ignoreDisplacements,
      accessibilityLevel,
      accessibility;
    if (typeof args === 'string') {
      tag = args;
    } else if (typeof args === 'object') {
      tag = args.tag;
      sizeMode = args.sizeMode;
      target = args.target;
      fully = args.fully;
      selector = args.selector;
      region = args.region;
      scriptHooks = args.scriptHooks;
      ignore = args.ignore;
      floating = args.floating;
      layout = args.layout;
      strict = args.strict;
      content = args.content;
      sendDom = args.sendDom;
      useDom = args.useDom;
      enablePatterns = args.enablePatterns;
      ignoreDisplacements = args.ignoreDisplacements;
      accessibilityLevel = args.accessibilityLevel;
      accessibility = args.accessibility;
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
            target,
            fully,
            blobData,
            selector,
            region,
            scriptHooks,
            ignore,
            floating,
            layout,
            content,
            strict,
            frames,
            sendDom,
            useDom,
            enablePatterns,
            ignoreDisplacements,
            accessibilityLevel,
            accessibility,
            referrer: win.location.href,
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
