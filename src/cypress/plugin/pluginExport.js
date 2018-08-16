'use strict';

function makePluginExport({getEyesPort, closeEyes}) {
  return function pluginExport(pluginModule) {
    const pluginModuleExports = pluginModule.exports;
    pluginModule.exports = async (...args) => {
      const actualEyesPort = await getEyesPort();
      const moduleExportsResult = await pluginModuleExports(...args);
      return Object.assign({eyesPort: actualEyesPort}, moduleExportsResult);
    };
    return {
      getEyesPort,
      closeEyes,
    };
  };
}

module.exports = makePluginExport;
