const fetch = require('node-fetch');
const {keyBy} = require('lodash');

// TODO test with fetch mock? nock?

module.exports = urls => {
  const promises = urls.map(url =>
    fetch(url).then(resp =>
      resp.buffer().then(buff => ({
        url,
        type: resp.headers.get('Content-Type'),
        value: buff,
      })),
    ),
  );

  return Promise.all(promises).then(resourceContents => keyBy(resourceContents, 'url'));
};
