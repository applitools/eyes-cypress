'use strict';

function makePluginExport({startServer, config}) {
  return function pluginExport(pluginModule) {
    let closeEyesServer;
    const pluginModuleExports = pluginModule.exports;
    pluginModule.exports = async (...args) => {
      const {eyesPort, closeServer} = await startServer();

      closeEyesServer = closeServer;
      const moduleExportsResult = await pluginModuleExports(...args);
      return Object.assign({eyesPort, eyesIsDisabled: !!config.isDisabled}, moduleExportsResult);
    };
    return function getCloseServer() {
      return closeEyesServer;
    };
  };
}

module.exports = makePluginExport;
