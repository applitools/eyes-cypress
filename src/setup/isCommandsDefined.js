'use strict';

function isCommandsDefined(content) {
  return !!content.match(/['"]@applitools\/eyes-cypress\/commands['"]\s*/);
}

module.exports = isCommandsDefined;
