'use strict';

function makeSend(port, fetch) {
  return function send({
    command,
    data,
    method = 'POST',
    headers = {'Content-Type': 'application/json'},
  }) {
    return fetch(`https://localhost:${port}/eyes/${command}`, {
      method,
      body: headers['Content-Type'] === 'application/json' ? JSON.stringify(data) : data,
      headers,
    });
  };
}

module.exports = makeSend;
