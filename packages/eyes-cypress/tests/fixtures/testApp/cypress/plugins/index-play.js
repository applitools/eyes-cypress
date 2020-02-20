// eslint-disable-next-line
const fetch = require('node-fetch');

async function getUrls() {
  const sitemapUrl = 'http://a142332.hostedsitemap.com/4049686/urllist.txt';
  const filters = [/\/blog/, /\.png/, /\.pdf/];

  const resp = await fetch(sitemapUrl);
  const text = await resp.text();
  return text.split(/\n/g).filter(u => !filters.some(f => u.match(f)) && u.includes('/docs'));
}

// eslint-disable-next-line
const startTestServer = require('../../../../util/testServer');

module.exports = async (on, _config) => {
  on('task', {getUrls});
  const testServer = await startTestServer();
  return {testPort: testServer.port};
};

// eslint-disable-next-line
require('../../../../..')(module);
