'use strict';

function makeSend(port, fetch) {
  return function send({command, data, method = 'POST', headers}) {
    return fetch({
      url: `http://localhost:${port}/eyes/${command}`,
      method,
      body: data,
      log: false,
      headers,
    });
  };
}

module.exports = makeSend;
