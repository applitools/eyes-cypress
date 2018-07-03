'use strict';

/**
 * For this function to be testable via puppeteer, it should be seriablizable. So all utility functions are written as closures and there are no external imports
 * @param {HTMLElement} el the root element from under which DOM tree to extract resources
 */
function extractResources(el) {
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

  return uniq([...srcUrls, ...cssUrls, ...videoPosterUrls]);
}

module.exports = extractResources;
