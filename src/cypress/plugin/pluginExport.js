'use strict';

function makePluginExport({eyesPort, getEyesPort, setEyesPort, closeEyes}) {
  return function pluginExport(pluginModule, {port = eyesPort} = {}) {
    const pluginModuleExports = pluginModule.exports;
    pluginModule.exports = async (...args) => {
      const actualEyesPort = await getEyesPort();
      const moduleExportsResult = await pluginModuleExports(...args);
      return Object.assign({eyesPort: actualEyesPort}, moduleExportsResult);
    };
    setEyesPort(port);
    return {
      getEyesPort,
      closeEyes,
    };
  };
}

module.exports = makePluginExport;
