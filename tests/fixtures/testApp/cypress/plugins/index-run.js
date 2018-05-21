/* eslint-disable */
require('../../../../../src/cypress/plugin');

const startTestServer = require('../../../../util/testServer');

module.exports = async (_on, _config) => {
  const testServer = await startTestServer();
  return {testPort: testServer.port};
};
