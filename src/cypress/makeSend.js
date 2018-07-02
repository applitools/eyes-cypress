'use strict';
module.exports = (port, fetch) => (command, data) =>
  fetch({
    url: `http://localhost:${port}/eyes/${command}`,
    method: 'POST',
    body: data,
    log: false,
  });
