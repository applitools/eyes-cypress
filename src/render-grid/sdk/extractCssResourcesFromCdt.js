'use strict';
const extractCssResources = require('./extractCssResources');

function extractCssResourcesFromCdt(cdt, baseUrl) {
  return cdt.reduce((acc, node) => {
    if (node.nodeName === 'STYLE') {
      const cssText = node.childNodeIndexes.map(index => cdt[index].nodeValue).join('');
      return acc.concat(extractCssResources(cssText, baseUrl));
    } else return acc;
  }, []);
}

module.exports = extractCssResourcesFromCdt;
