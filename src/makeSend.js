'use strict';
module.exports = (port, fetch) => ({command, data, method = 'POST', headers}) =>
  fetch({
    url: `http://localhost:${port}/eyes/${command}`,
    method,
    body: data,
    log: false,
    headers,
  });
