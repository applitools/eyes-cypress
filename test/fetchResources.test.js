const fetchResources = require('../src/fetchResources');
const {expect} = require('chai');
const nock = require('nock');

describe('fetchResources', () => {
  it('works', async () => {
    const expected = [
      {type: 'image/png', value: 'some image'},
      {type: 'text/css', value: 'some css'},
      {type: 'application/json', value: 'some json'},
      {type: 'application/javascript', value: 'some javascript'},
    ];

    nock('http://some')
      .get('/url.png')
      .reply(200, expected[0].value, {'Content-Type': expected[0].type})
      .get('/url.css')
      .reply(200, expected[1].value, {'Content-Type': expected[1].type})
      .get('/url.json')
      .reply(200, expected[2].value, {'Content-Type': expected[2].type})
      .get('/url.js')
      .reply(200, expected[3].value, {'Content-Type': expected[3].type});

    const resources = await fetchResources([
      'http://some/url.png',
      'http://some/url.css',
      'http://some/url.json',
      'http://some/url.js',
    ]);

    expect(resources).to.deep.equal(
      expected.map(x => ({...x, value: Buffer.from(x.value, 'utf-8')})),
    );
  });
});
