const {uniq} = require('lodash');

module.exports = el => {
  const srcUrls = [...el.querySelectorAll('img[src],script[src]')].map(srcEl =>
    srcEl.getAttribute('src'),
  );

  const cssUrls = [...el.querySelectorAll('link[rel="stylesheet"]')].map(link =>
    link.getAttribute('href'),
  );

  return uniq([...srcUrls, ...cssUrls]);
};
