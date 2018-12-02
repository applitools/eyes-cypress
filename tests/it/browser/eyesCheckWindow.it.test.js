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
    const frames = [];
    const Blob = function() {};
    const eyesCheckWindow = makeEyesCheckWindow({sendRequest, processPage, Blob});

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
        floating: undefined,
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

    async function processPage() {
      return {resourceUrls, blobs, frames, url, cdt};
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
    const frames = [];
    const Blob = function() {};
    const eyesCheckWindow = makeEyesCheckWindow({sendRequest, processPage, Blob});

    const tag = 'some tag';
    const sizeMode = 'sizeMode';
    const selector = 'selector';
    const region = 'region';
    const scriptHooks = 'scriptHooks';
    const ignore = 'ignore';
    const floating = 'floating';
    const sendDom = 'sendDom';

    await eyesCheckWindow('bla doc', {
      tag,
      sizeMode,
      selector,
      region,
      scriptHooks,
      ignore,
      floating,
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
        floating,
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

    async function processPage() {
      return {resourceUrls, blobs, frames, url, cdt};
    }
  });

  it('uploads blobs from all frames and then sends only url+type (blobData)', async () => {
    let sendRequestInput;
    const resourcesPutted = [];

    const blob1 = {url: 'blobUrl1', type: 'blobType1', value: 'bla1'};
    const blob2 = {url: 'blobUrl2', type: 'blobType2', value: 'bla2'};
    const blob3 = {url: 'blobUrl3', type: 'blobType3', value: 'blab3'};
    const blobs = [blob1];
    const resourceUrls = 'resourceUrls';
    const url = 'url';
    const cdt = 'cdt';
    const innerFrame = {
      url: 'url2',
      resourceUrls: [],
      blobs: [blob1, blob3],
      cdt: 'cdt2',
      frames: [],
    };
    const frames = [
      {url: 'url1', resourceUrls: [], blobs: [blob1, blob2], cdt: 'cdt1', frames: [innerFrame]},
    ];
    const Blob = function() {};
    const eyesCheckWindow = makeEyesCheckWindow({sendRequest, processPage, Blob});

    await eyesCheckWindow('bla doc');

    expect(sendRequestInput).to.eql({
      command: 'checkWindow',
      data: {
        url,
        cdt,
        resourceUrls,
        blobData: [{url: 'blobUrl1', type: 'blobType1'}],
        frames: [
          {
            url: 'url1',
            resourceUrls: [],
            blobData: [{url: 'blobUrl1', type: 'blobType1'}, {url: 'blobUrl2', type: 'blobType2'}],
            cdt: 'cdt1',
            frames: [
              {
                url: 'url2',
                resourceUrls: [],
                blobData: [
                  {url: 'blobUrl1', type: 'blobType1'},
                  {url: 'blobUrl3', type: 'blobType3'},
                ],
                cdt: 'cdt2',
                frames: [],
              },
            ],
          },
        ],
        tag: undefined,
        sizeMode: undefined,
        selector: undefined,
        region: undefined,
        scriptHooks: undefined,
        ignore: undefined,
        floating: undefined,
        sendDom: undefined,
      },
    });
    expect(resourcesPutted).to.eql([
      {
        command: `resource/blobUrl1`,
        data: new Blob(['bla1']),
        method: 'PUT',
        headers: {'Content-Type': 'blobType1'},
      },
      {
        command: `resource/blobUrl2`,
        data: new Blob(['bla2']),
        method: 'PUT',
        headers: {'Content-Type': 'blobType2'},
      },
      {
        command: `resource/blobUrl3`,
        data: new Blob(['bla3']),
        method: 'PUT',
        headers: {'Content-Type': 'blobType3'},
      },
    ]);

    function sendRequest(arg) {
      if (arg.command === 'checkWindow') sendRequestInput = arg;
      else {
        resourcesPutted.push(arg);
      }
    }

    async function processPage() {
      return {resourceUrls, blobs, frames, url, cdt};
    }
  });
});
