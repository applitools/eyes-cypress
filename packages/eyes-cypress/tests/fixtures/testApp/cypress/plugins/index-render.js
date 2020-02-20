// eslint-disable-next-line
const fetch = require('node-fetch');

// eslint-disable-next-line
const startTestServer = require('../../../../util/testServer');

module.exports = async () => {
  const testServer = await startTestServer();
  return {testPort: testServer.port};
};

// eslint-disable-next-line
require('../../../../../')(module);
