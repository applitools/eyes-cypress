'use strict';
const {promisify: p} = require('util');
const path = require('path');
const express = require('express');
const app = express();
app.use('/', express.static(path.resolve(__dirname, '../fixtures')));

module.exports = ({port = 0, showLog = false} = {}) => {
  return new Promise((resolve, _reject) => {
    const server = app.listen(port, () => {
      const serverPort = server.address().port;
      const close = p(server.close.bind(server));
      showLog && console.log(`server running at port: ${serverPort}`);
      resolve({port: serverPort, close});
    });
  });
};
