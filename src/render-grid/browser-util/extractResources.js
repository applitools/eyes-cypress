'use strict';

/**
 * For this function to be testable via puppeteer, it should be seriablizable. So all utility functions are written as closures and there are no external imports
 * @param {HTMLElement} el the root element from under which DOM tree to extract resources
 */
function extractResources(el, win) {
  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  const srcUrls = [...el.querySelectorAll('img[src],source[src]')].map(srcEl =>
    srcEl.getAttribute('src'),
  );

  const cssUrls = [...el.querySelectorAll('link[rel="stylesheet"]')].map(link =>
    link.getAttribute('href'),
  );

  const videoPosterUrls = [...el.querySelectorAll('video[poster]')].map(videoEl =>
    videoEl.getAttribute('poster'),
  );

  const allResourceUrls = uniq([...srcUrls, ...cssUrls, ...videoPosterUrls]);

  const blobUrls = [],
    resourceUrls = [];

  allResourceUrls.forEach(url => {
    if (/^blob:/.test(url)) {
      blobUrls.push(url);
    } else {
      resourceUrls.push(url);
    }
  });

  return Promise.all(
    blobUrls.map(blobUrl =>
      win.fetch(blobUrl).then(resp =>
        resp.arrayBuffer().then(buff => ({
          url: blobUrl.replace(/^blob:http:\/\/localhost:\d+\/(.+)/, '$1'), // TODO don't replace localhost once render-grid implements absolute urls
          type: resp.headers.get('Content-Type'),
          value: buff,
        })),
      ),
    ),
  ).then(blobs => ({
    resourceUrls,
    blobs,
  }));
}

module.exports = extractResources;
