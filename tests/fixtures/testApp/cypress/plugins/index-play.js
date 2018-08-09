// eslint-disable-next-line
const fetch = require('node-fetch');

function uniq(arr) {
  return Array.from(new Set(arr));
}

function getUrls() {
  const sitemapUrl = 'http://a142332.hostedsitemap.com/4049686/urllist.txt';
  const filters = [/\/blog/, /\/docs\//, /\.png/, /\.pdf/];
  return fetch(sitemapUrl)
    .then(res => res.text())
    .then(text =>
      uniq(
        text
          .split(/\n/g)
          .filter(u => !filters.some(f => u.match(f)))
          .map(u => {
            let qpIndex = u.indexOf('?');
            if (qpIndex > -1) {
              return u.substring(0, qpIndex);
            }
            return u;
          }),
      ),
    );
}

// eslint-disable-next-line
const startTestServer = require('../../../../util/testServer');

module.exports = async (on, _config) => {
  on('task', {getUrls});
  const testServer = await startTestServer();
  return {testPort: testServer.port};
};

// eslint-disable-next-line
require('../../../../../src/cypress/plugin')(module, {port: 0});
