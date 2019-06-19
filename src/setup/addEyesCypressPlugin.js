'use strict';

const pluginRequire = `\n\nrequire('@applitools/eyes-cypress')(module);\n`;
const oldName = `eyes.cypress`;

function addEyesCypressPlugin(content) {
  if (!content.includes(oldName)) {
    return content.replace(/([\s\S])$/, `$1${pluginRequire}`);
  } else {
    return content.replace(oldName, 'eyes-cypress');
  }
}

module.exports = addEyesCypressPlugin;
module.exports.pluginRequire = pluginRequire;
