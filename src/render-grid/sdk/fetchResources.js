const fetch = require('node-fetch');
const {keyBy} = require('lodash');
const {parse, CSSImportRule, CSSStyleRule, CSSFontFaceRule} = require('cssom');
const {URL} = require('url');
const extractResourcesFromStyleSheet = require('../shared/extractResourcesFromStyleSheet');

function extractCssResources(cssText, absoluteUrl) {
  const styleSheet = parse(cssText);
  return extractResourcesFromStyleSheet(styleSheet, absoluteUrl, {
    isCSSImportRule: rule => rule instanceof CSSImportRule,
    isCSSFontFaceRule: rule => rule instanceof CSSFontFaceRule,
    isCSSStyleRule: rule => rule instanceof CSSStyleRule,
    URL,
  });
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
