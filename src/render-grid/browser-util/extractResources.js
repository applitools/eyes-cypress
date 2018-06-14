'use strict';

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

  const srcUrls = [...el.querySelectorAll('img[src]')].map(srcEl => srcEl.getAttribute('src'));

  const cssUrls = [...el.querySelectorAll('link[rel="stylesheet"]')].map(link =>
    link.getAttribute('href'),
  );

  const urlsFromStyleElements = [...el.getElementsByTagName('style')]
    .map(styleEl => styleEl.sheet)
    .reduce((acc, curr) => {
      console.log('acc', acc);
      const resourceUrls = extractResourcesFromStyleSheet(curr);
      console.log('resources', resourceUrls);
      return acc.concat(resourceUrls);
    }, []);

  return uniq([...srcUrls, ...cssUrls, ...urlsFromStyleElements]);
}

module.exports = extractResources;
