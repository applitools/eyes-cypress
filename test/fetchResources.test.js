const fetchResources = require('../src/server/fetchResources');
const {expect} = require('chai');
const nock = require('nock');
const {mapValues} = require('lodash');

describe('fetchResources', () => {
  it('works', async () => {
    const expected = mapValues(
      {
        'http://some/url.png': {type: 'image/png', value: 'some image'},
        'http://some/url.css': {type: 'text/css', value: 'some css'},
        'http://some/url.json': {type: 'application/json', value: 'some json'},
        'http://some/url.js': {type: 'application/javascript', value: 'some javascript'},
      },
      (o, url) => ({type: o.type, value: Buffer.from(o.value, 'utf-8'), url}),
    );

    nock('http://some')
      .get('/url.png')
      .reply(200, 'some image', {'Content-Type': 'image/png'})
      .get('/url.css')
      .reply(200, 'some css', {'Content-Type': 'text/css'})
      .get('/url.json')
      .reply(200, 'some json', {'Content-Type': 'application/json'})
      .get('/url.js')
      .reply(200, 'some javascript', {'Content-Type': 'application/javascript'});

    const resources = await fetchResources([
      'http://some/url.png',
      'http://some/url.css',
      'http://some/url.json',
      'http://some/url.js',
    ]);

    expect(resources).to.deep.equal(expected);
  });
});
