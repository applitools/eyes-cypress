'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const EyesRunner = require('../src/server/EyesRunner');
const FakeEyesWrapper = require('./FakeEyesWrapper');
const nock = require('nock');

describe('EyesRunner', () => {
  it('works', () => {
    nock('http://some')
      .get('/url/test.html')
      .reply(200, 'some html', {'Content-Type': 'text/html'})
      .get('/url/some_image.png')
      .reply(200, 'some image', {'Content-Type': 'image/png'})
      .get('/url/some_stylesheet.css')
      .reply(200, 'some css', {'Content-Type': 'text/css'});

    const {checkWindow, close} = EyesRunner({
      appName: 'some app',
      testName: 'some test',
      wrapper: FakeEyesWrapper,
      url: 'http://some/url/test.html', // TODO test different forms of url? or leave that to unit tests?
    });
    const resourceUrls = ['some_image.png', 'some_stylesheet.css'];
    checkWindow({resourceUrls});
    close();
  });
});
