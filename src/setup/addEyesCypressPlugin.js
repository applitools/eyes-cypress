'use strict';

const pluginRequire = `\n\nrequire('@applitools/eyes.cypress')(module);\n`;

function addEyesCypressPlugin(content) {
  return content.replace(/([\s\S])$/, `$1${pluginRequire}`);
}

module.exports = addEyesCypressPlugin;
module.exports.pluginRequire = pluginRequire;
