const fetch = require('node-fetch'); // TODO if window/global.fetch

// TODO test with fetch mock? nock?

module.exports = urls => {
  const promises = urls.map(url =>
    fetch(url).then(resp =>
      resp.buffer().then(buff => ({
        type: resp.headers.get('content-type'),
        value: buff,
      })),
    ),
  );
  return Promise.all(promises);
};
