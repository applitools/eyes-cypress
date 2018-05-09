const {startServer} = require('@applitools/eyes.cypress');
const startTestServer = require('../../../../util/testServer');

module.exports = async (_on, _config) => {
  const {eyesPort} = await startServer();
  const testServer = await startTestServer();
  return {eyesPort, testPort: testServer.port};
};
