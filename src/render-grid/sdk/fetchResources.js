const fetch = require('node-fetch');
const {keyBy} = require('lodash');
const {parse, CSSImportRule, CSSStyleRule, CSSFontFaceRule} = require('cssom');
const {URL} = require('url');
const log = require('./log');

// NOTE: this is also implemented on the client side (copy pasted to enable unit testing `extractResources` with puppeteer)
function getUrlFromCssText(cssText) {
  const match = cssText.match(/url\((?!['"]?(?:data|http):)['"]?([^'"\)]*)['"]?\)/);
  return match ? match[1] : match;
}

// should this simple yet repetitive thing be exported as a separate module?
function absolutizeUrl(url, absoluteUrl) {
  return new URL(url, absoluteUrl).href;
}

// NOTE: this is also implemented on the client side (copy pasted to enable unit testing `extractResources` with puppeteer)
function extractResourcesFromStyleSheet(styleSheet) {
  const resourceUrls = [...styleSheet.cssRules].reduce((acc, rule) => {
    if (rule instanceof CSSImportRule) {
      return acc.concat(rule.href);
    } else if (rule instanceof CSSFontFaceRule) {
      return acc.concat(getUrlFromCssText(rule.style.getPropertyValue('src')));
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
  const styleSheet = parse(cssText);
  return extractResourcesFromStyleSheet(styleSheet).map(url => absolutizeUrl(url, absoluteUrl));
}

function fetchResources(urls) {
  function doFetch(resourceUrls) {
    log(`fetching [${resourceUrls}]`);
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
    log('done fetching');
    return keyBy(resources, 'url');
  });
}

module.exports = fetchResources;
