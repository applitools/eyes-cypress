function extractResourcesFromStyleSheet(
  styleSheet,
  absoluteUrl,
  {isCSSImportRule, isCSSStyleRule, isCSSFontFaceRule, URL},
) {
  function absolutizeUrl(url, absoluteUrl) {
    return new URL(url, absoluteUrl).href;
  }

  const resourceUrls = [...styleSheet.cssRules].reduce((acc, rule) => {
    if (isCSSImportRule(rule)) {
      return acc.concat(absolutizeUrl(rule.href, absoluteUrl));
    } else if (isCSSFontFaceRule(rule)) {
      return acc.concat(
        absolutizeUrl(getUrlFromCssText(rule.style.getPropertyValue('src')), absoluteUrl),
      );
    } else if (isCSSStyleRule(rule)) {
      for (let i = 0, ii = rule.style.length; i < ii; i++) {
        const url = getUrlFromCssText(rule.style.getPropertyValue(rule.style[i]));
        url && acc.push(absolutizeUrl(url, absoluteUrl));
      }
    }
    return acc;
  }, []);
  return [...new Set(resourceUrls)];
}

function getUrlFromCssText(cssText) {
  const match = cssText.match(/url\((?!['"]?(?:data|http):)['"]?([^'"\)]*)['"]?\)/);
  return match ? match[1] : match;
}

module.exports = extractResourcesFromStyleSheet;
