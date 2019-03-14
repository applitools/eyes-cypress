'use strict';

const makeHandleCypressViewport = ({cy}) => {
  return browser => {
    let rv = cy;
    if (Array.isArray(browser) && browser.length === 1) {
      browser = browser[0];
    }

    if (
      typeof browser === 'object' &&
      browser !== null &&
      browser.width !== undefined &&
      browser.height !== undefined
    ) {
      rv = rv.viewport(browser.width, browser.height);
    }
    return rv;
  };
};

module.exports = makeHandleCypressViewport;
