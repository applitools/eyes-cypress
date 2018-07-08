'use strict';
const fetch = require('node-fetch');

module.exports = (url, logger) => {
  logger.log(`fetching ${url}`);
  return fetch(url).then(resp =>
    resp.buffer().then(buff => ({
      url,
      type: resp.headers.get('Content-Type'),
      value: buff,
    })),
  );
};
