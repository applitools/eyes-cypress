'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeEyesCheckWindow = require('../../../src/browser/eyesCheckWindow');

describe('eyesCheckWindow', () => {
  it('handles string input', async () => {
    let sendRequestInput;
    const resourcesPutted = [];

    const blob1 = {url: 'blobUrl1', type: 'blobType1', value: 'bla'};
    const blob2 = {url: 'blobUrl2', type: 'blobType2', value: 'blabla'};
    const blobs = [blob1, blob2];
    const resourceUrls = 'resourceUrls';
    const url = 'url';
    const cdt = 'cdt';
    const allBlobs = [blob1, blob2];
    const frames = [];
    const Blob = function() {};
    const eyesCheckWindow = makeEyesCheckWindow({sendRequest, processDocument, Blob});

    const tag = 'some tag';

    await eyesCheckWindow('bla doc', tag);
    expect(sendRequestInput).to.eql({
      command: 'checkWindow',
      data: {
        url,
        cdt,
        resourceUrls,
        blobData: [{url: 'blobUrl1', type: 'blobType1'}, {url: 'blobUrl2', type: 'blobType2'}],
        frames,
        tag,
        ignore: undefined,
        region: undefined,
        scriptHooks: undefined,
        selector: undefined,
        sendDom: undefined,
        sizeMode: undefined,
      },
    });
    expect(resourcesPutted).to.eql([
      {
        command: `resource/blobUrl1`,
        data: new Blob(['bla']),
        method: 'PUT',
        headers: {'Content-Type': 'blobType1'},
      },
      {
        command: `resource/blobUrl2`,
        data: new Blob(['blabla']),
        method: 'PUT',
        headers: {'Content-Type': 'blobType2'},
      },
    ]);

    function sendRequest(arg) {
      if (arg.command === 'checkWindow') sendRequestInput = arg;
      else {
        resourcesPutted.push(arg);
      }
    }

    async function processDocument() {
      return {resourceUrls, blobs, frames, url, cdt, allBlobs};
    }
  });

  it('handles object input', async () => {
    let sendRequestInput;
    const resourcesPutted = [];

    const blob1 = {url: 'blobUrl1', type: 'blobType1', value: 'bla'};
    const blob2 = {url: 'blobUrl2', type: 'blobType2', value: 'blabla'};
    const blobs = [blob1, blob2];
    const resourceUrls = 'resourceUrls';
    const url = 'url';
    const cdt = 'cdt';
    const allBlobs = [blob1, blob2];
    const frames = [];
    const Blob = function() {};
    const eyesCheckWindow = makeEyesCheckWindow({sendRequest, processDocument, Blob});

    const tag = 'some tag';
    const sizeMode = 'sizeMode';
    const selector = 'selector';
    const region = 'region';
    const scriptHooks = 'scriptHooks';
    const ignore = 'ignore';
    const sendDom = 'sendDom';

    await eyesCheckWindow('bla doc', {
      tag,
      sizeMode,
      selector,
      region,
      scriptHooks,
      ignore,
      sendDom,
    });

    expect(sendRequestInput).to.eql({
      command: 'checkWindow',
      data: {
        url,
        cdt,
        resourceUrls,
        blobData: [{url: 'blobUrl1', type: 'blobType1'}, {url: 'blobUrl2', type: 'blobType2'}],
        frames,
        tag,
        sizeMode,
        selector,
        region,
        scriptHooks,
        ignore,
        sendDom,
      },
    });
    expect(resourcesPutted).to.eql([
      {
        command: `resource/blobUrl1`,
        data: new Blob(['bla']),
        method: 'PUT',
        headers: {'Content-Type': 'blobType1'},
      },
      {
        command: `resource/blobUrl2`,
        data: new Blob(['blabla']),
        method: 'PUT',
        headers: {'Content-Type': 'blobType2'},
      },
    ]);

    function sendRequest(arg) {
      if (arg.command === 'checkWindow') sendRequestInput = arg;
      else {
        resourcesPutted.push(arg);
      }
    }

    async function processDocument() {
      return {resourceUrls, blobs, frames, url, cdt, allBlobs};
    }
  });
});
