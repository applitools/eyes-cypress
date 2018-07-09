'use strict';

const pluginRequire = `\nrequire('@applitools/eyes.cypress');\n`;

function shouldSkipLine(line) {
  return line.trim() === '' || /^\s*['"]use strict/.test(line) || /^\s*\/\//.test(line);
}

function addEyesCypressPlugin(content) {
  const lines = content.split('\n');
  let i = 0;
  while (shouldSkipLine(lines[i++])) {}
  let index = i === 1 ? i : i - 1;
  // if (i > 1) lines.splice(index++, 0, '\n');
  lines.splice(index, 0, pluginRequire);

  return lines.join('\n');

  // return content.replace(/^()?/, pluginRequire);
}

module.exports = addEyesCypressPlugin;
module.exports.pluginRequire = pluginRequire;
