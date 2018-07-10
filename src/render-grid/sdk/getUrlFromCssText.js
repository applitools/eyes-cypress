'use strict';

function getUrlFromCssText(cssText) {
  const re = /url\((?!['"]?:)['"]?([^'"\)]*)['"]?\)/g;
  const ret = [];
  let result;
  while ((result = re.exec(cssText)) !== null) {
    ret.push(result[1]);
  }
  return ret;
}

module.exports = getUrlFromCssText;
