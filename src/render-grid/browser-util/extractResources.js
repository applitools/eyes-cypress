const {uniq} = require('lodash');
const extractResourcesFromStyleSheets = require('../shared/extractResourcesFromStyleSheet');

module.exports = el => {
  const srcUrls = [...el.querySelectorAll('img[src]')].map(srcEl => srcEl.getAttribute('src'));

  const cssUrls = [...el.querySelectorAll('link[rel="stylesheet"]')].map(link =>
    link.getAttribute('href'),
  );

  const urlsFromStyleElements = [...el.getElementsByTagName('style')]
    .map(styleEl => styleEl.sheet)
    .reduce((acc, curr) => {
      console.log('acc', acc);
      const resourceUrls = extractResourcesFromStyleSheets(curr, window.location.href, {
        isCSSImportRule: rule =>
          rule instanceof rule.parentStyleSheet.ownerNode.ownerDocument.defaultView.CSSImportRule,
        isCSSFontFaceRule: rule =>
          rule instanceof rule.parentStyleSheet.ownerNode.ownerDocument.defaultView.CSSFontFaceRule,
        isCSSStyleRule: rule =>
          rule instanceof rule.parentStyleSheet.ownerNode.ownerDocument.defaultView.CSSStyleRule,
        URL,
      });
      console.log('resources', resourceUrls);
      return acc.concat(resourceUrls);
    }, []);

  return uniq([...srcUrls, ...cssUrls, ...urlsFromStyleElements]);
};
