const fetch = require('node-fetch');
const log = require('./log');

module.exports = url => {
  log(`fetching ${url}`);
  return fetch(url).then(resp =>
    resp.buffer().then(buff => ({
      url,
      type: resp.headers.get('Content-Type'),
      value: buff,
    })),
  );
};
