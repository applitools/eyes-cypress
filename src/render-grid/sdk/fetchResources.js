const fetch = require('node-fetch');
const {keyBy} = require('lodash');
const {parse, CSSImportRule, CSSStyleRule, CSSFontFaceRule} = require('cssom');
const {URL} = require('url');

function getUrlFromCssText(cssText) {
  const match = cssText.match(/url\((?!['"]?(?:data|http):)['"]?([^'"\)]*)['"]?\)/);
  return match ? match[1] : match;
}

function absolutizeUrl(url, absoluteUrl) {
  return new URL(url, absoluteUrl).href;
}

function extractResourcesFromStyleSheet(styleSheet, absoluteUrl) {
  const resourceUrls = [...styleSheet.cssRules].reduce((acc, rule) => {
    if (rule instanceof CSSImportRule) {
      return acc.concat(absolutizeUrl(rule.href, absoluteUrl));
    } else if (rule instanceof CSSFontFaceRule) {
      return acc.concat(
        absolutizeUrl(getUrlFromCssText(rule.style.getPropertyValue('src')), absoluteUrl),
      );
    } else if (rule instanceof CSSStyleRule) {
      for (let i = 0, ii = rule.style.length; i < ii; i++) {
        const url = getUrlFromCssText(rule.style.getPropertyValue(rule.style[i]));
        url && acc.push(absolutizeUrl(url, absoluteUrl));
      }
    }
    return acc;
  }, []);
  return [...new Set(resourceUrls)];
}

function extractCssResources(cssText, absoluteUrl) {
  const styleSheet = parse(cssText);
  return extractResourcesFromStyleSheet(styleSheet, absoluteUrl);
}

function fetchResources(urls) {
  function doFetch(resourceUrls) {
    console.log('fetching ', resourceUrls);
    return Promise.all(
      resourceUrls.map(url =>
        fetch(url).then(resp =>
          resp.buffer().then(buff => {
            const contentType = resp.headers.get('Content-Type');
            resources.push({
              url,
              type: contentType,
              value: buff,
            });
            if (/text\/css/.test(contentType)) {
              return doFetch(extractCssResources(buff.toString(), url));
            } else {
              return true;
            }
          }),
        ),
      ),
    );
  }

  const resources = [];
  return doFetch(urls).then(() => {
    console.log('done fetching');
    return keyBy(resources, 'url');
  });
}

module.exports = fetchResources;
