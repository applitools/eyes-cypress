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
    pluginModule.exports = (on, config) => {
      on('before:browser:launch', (_browser, args) => {
        const defaultBatch = getBatch(getInitialConfig());
        logger.log('before:browser:launch', JSON.stringify(defaultBatch)); // TODO remove JSON.stringify after release eyes.sdk.core
        updateConfig(defaultBatch);
        return args;
      });
      return pluginModuleExports(on, config);
    };
    setEyesPort(port);
    return {
      getEyesPort,
      closeEyes,
    };
  };
}

module.exports = makePluginExport;
