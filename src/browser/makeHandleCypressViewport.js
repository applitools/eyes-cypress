const {TypeUtils} = require('@applitools/eyes-common');

const makeHandleCypressViewport = ({cy}) => {
  return browser => {
    let rv = cy;
    if (TypeUtils.isArray(browser) && browser.length === 1) {
      browser = browser[0];
    }

    if (
      TypeUtils.isObject(browser) &&
      browser.width !== undefined &&
      browser.height !== undefined
    ) {
      rv = rv.viewport(browser.width, browser.height);
    }
    return rv;
  };
};

module.exports = makeHandleCypressViewport;
