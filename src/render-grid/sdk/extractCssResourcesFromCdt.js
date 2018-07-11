'use strict';
const getUrlFromCssText = require('./getUrlFromCssText');

function makeExtractCssResourcesFromCdt(extractCssResources) {
  return function extractCssResourcesFromCdt(cdt, baseUrl) {
    return cdt.reduce((acc, node) => {
      if (node.nodeName === 'STYLE') {
        const cssText = node.childNodeIndexes.map(index => cdt[index].nodeValue).join('');
        acc = acc.concat(extractCssResources(cssText, baseUrl));
      } else if (node.nodeType === 1) {
        const styleAttr =
          node.attributes && node.attributes.find(attr => attr.name.toUpperCase() === 'STYLE');

        if (styleAttr) acc = acc.concat(getUrlFromCssText(styleAttr.value));
      }
      return acc;
    }, []);
  };
}

module.exports = makeExtractCssResourcesFromCdt;
