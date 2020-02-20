/* eslint-disable */
const startTestServer = require('../../../../util/testServer');

module.exports = async (_on, _config) => {
  const testServer = await startTestServer();
  return {testPort: testServer.port};
};

require('@applitools/eyes-cypress')(module);