'use strict';

/**
 * For this function to be testable via puppeteer, it should be seriablizable. So all utility functions are written as closures and there are no external imports
 * @param {HTMLElement} el the root element from under which DOM tree to extract resources
 */
function extractResources(el) {
  function extractResourcesFromStyleSheet(styleSheet) {
    const resourceUrls = [...styleSheet.cssRules].reduce((acc, rule) => {
      if (isRuleOfType(rule, 'CSSImportRule')) {
        return acc.concat(rule.href);
      } else if (isRuleOfType(rule, 'CSSFontFaceRule')) {
        return acc.concat(getUrlFromCssText(rule.style.getPropertyValue('src')));
      } else if (isRuleOfType(rule, 'CSSStyleRule')) {
        for (let i = 0, ii = rule.style.length; i < ii; i++) {
          const url = getUrlFromCssText(rule.style.getPropertyValue(rule.style[i]));
          url && acc.push(url);
        }
      }
      return acc;
    }, []);
    return [...new Set(resourceUrls)];
  }

  // NOTE: this is also implemented on the server side (copy pasted to enable unit testing `extractResources` with puppeteer)
  function getUrlFromCssText(cssText) {
    const match = cssText.match(/url\((?!['"]?(?:data|http):)['"]?([^'"\)]*)['"]?\)/);
    return match ? match[1] : match;
  }

  function isRuleOfType(rule, ruleType) {
    return rule instanceof rule.parentStyleSheet.ownerNode.ownerDocument.defaultView[ruleType];
  }

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

  const urlsFromStyleElements = [...el.getElementsByTagName('style')]
    .map(styleEl => styleEl.sheet)
    .reduce((acc, curr) => {
      const resourceUrls = extractResourcesFromStyleSheet(curr);
      return acc.concat(resourceUrls);
    }, []);

  return uniq([...srcUrls, ...cssUrls, ...urlsFromStyleElements, ...videoPosterUrls]);
}

module.exports = extractResources;
