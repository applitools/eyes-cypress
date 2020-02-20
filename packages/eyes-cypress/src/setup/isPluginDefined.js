'use strict';

function isPluginDefined(content) {
  return !!content.match(/require\s*\(\s*['"]@applitools\/eyes-cypress['"]\s*\)/);
}

module.exports = isPluginDefined;
