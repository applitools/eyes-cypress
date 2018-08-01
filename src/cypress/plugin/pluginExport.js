'use strict';

function makePluginExport({
  eyesPort,
  updateConfig,
  getInitialConfig,
  getBatch,
  logger,
  getEyesPort,
  setEyesPort,
  closeEyes,
}) {
  return function pluginExport(pluginModule, {port = eyesPort} = {}) {
    const pluginModuleExports = pluginModule.exports;
    pluginModule.exports = async (...args) => {
      const on = args[0];
      on('before:browser:launch', (_browser, browserArgs) => {
        const defaultBatch = getBatch(getInitialConfig());
        logger.log('before:browser:launch', JSON.stringify(defaultBatch)); // TODO remove JSON.stringify after release eyes.sdk.core
        updateConfig(defaultBatch);
        return browserArgs;
      });
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
