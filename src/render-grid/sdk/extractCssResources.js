'use strict';
const {parse, CSSImportRule, CSSStyleRule, CSSFontFaceRule, CSSSupportsRule} = require('cssom');
const absolutizeUrl = require('./absolutizeUrl');

function getUrlFromCssText(cssText) {
  const match = cssText.match(/url\((?!['"]?:)['"]?([^'"\)]*)['"]?\)/);
  return match ? match[1] : match;
}

function extractResourcesFromStyleSheet(styleSheet) {
  const resourceUrls = [...styleSheet.cssRules].reduce((acc, rule) => {
    if (rule instanceof CSSImportRule) {
      return acc.concat(rule.href);
    } else if (rule instanceof CSSFontFaceRule) {
      return acc.concat(getUrlFromCssText(rule.style.getPropertyValue('src')));
    } else if (rule instanceof CSSSupportsRule) {
      return acc.concat(extractResourcesFromStyleSheet(rule));
    } else if (rule instanceof CSSStyleRule) {
      for (let i = 0, ii = rule.style.length; i < ii; i++) {
        const url = getUrlFromCssText(rule.style.getPropertyValue(rule.style[i]));
        url && acc.push(url);
      }
    }
    return acc;
  }, []);
  return [...new Set(resourceUrls)];
}

function extractCssResources(cssText, absoluteUrl) {
  let styleSheet;

  try {
    styleSheet = parse(cssText);
  } catch (ex) {
    console.error(ex);
    return [];
  }

  return extractResourcesFromStyleSheet(styleSheet).map(url => absolutizeUrl(url, absoluteUrl));
}

module.exports = extractCssResources;
