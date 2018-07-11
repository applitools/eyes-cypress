'use strict';
const fetch = require('node-fetch');

function makeFetchResource(logger) {
  return url => {
    logger.log(`fetching ${url}`);
    return fetch(url).then(resp =>
      resp.buffer().then(buff => ({
        url,
        type: resp.headers.get('Content-Type'),
        value: buff,
      })),
    );
  };
}

module.exports = makeFetchResource;
