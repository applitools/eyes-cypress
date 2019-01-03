'use strict';

function makePluginExport({startServer, getConfig}) {
  return function pluginExport(pluginModule) {
    let closeEyesServer;
    const pluginModuleExports = pluginModule.exports;
    pluginModule.exports = async (...args) => {
      const {eyesPort, closeServer} = await startServer({getConfig});

      closeEyesServer = closeServer;
      const moduleExportsResult = await pluginModuleExports(...args);
      const {isDisabled: eyesIsDisabled} = getConfig();
      return Object.assign({eyesPort, eyesIsDisabled}, moduleExportsResult);
    };
    return function getCloseServer() {
      return closeEyesServer;
    };
  };
}

module.exports = makePluginExport;
