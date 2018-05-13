/* eslint-disable */
require('@applitools/eyes.cypress');

const startTestServer = require('../../../../util/testServer');

module.exports = async (_on, _config) => {
  const testServer = await startTestServer();
  return {testPort: testServer.port};
};
