/* global Cypress,cy,window */
'use strict';
const {extractResources, domNodesToCdt} = require('@applitools/rendering-grid-client/browser');
const poll = require('./poll');
const makeSend = require('./makeSend');
const port = Cypress.config('eyesPort') || require('./plugin/defaultPort');
const send = makeSend(port, cy.request);
const captureFrame = require('@applitools/dom-capture/src/captureFrame');
const defaultDomProps = require('@applitools/dom-capture/src/defaultDomProps');

Cypress.Commands.add('eyesOpen', (args = {}) => {
  Cypress.log({name: 'Eyes: open'});
  return sendRequest({command: 'open', data: args});
});

Cypress.Commands.add('eyesCheckWindow', args => {
  let tag, sizeMode, selector, region;
  if (typeof args === 'string') {
    tag = args;
  } else if (typeof args === 'object') {
    tag = args.tag;
    sizeMode = args.sizeMode;
    selector = args.selector;
    region = args.region;
  }

  Cypress.log({name: 'Eyes: check window'});
  return cy.document({log: false}).then(doc =>
    cy.window({log: false}).then(win => {
      const cdt = domNodesToCdt(doc);
      const domCapture = captureFrame(defaultDomProps);
      const url = win.location.href;
      return extractResources(doc, win).then(({resourceUrls, blobs}) => {
        const blobData = blobs.map(({url, type}) => ({url, type}));
        return Promise.all(blobs.map(putResource)).then(() =>
          sendRequest({
            command: 'checkWindow',
            data: {url, resourceUrls, cdt, tag, sizeMode, blobData, domCapture, selector, region},
          }),
        );
      });
    }),
  );
});

const close = poll(function({timeout}) {
  return sendRequest({command: 'close', data: {timeout}});
});

Cypress.Commands.add('eyesClose', ({timeout} = {}) => {
  Cypress.log({name: 'Eyes: close'});
  return close({timeout});
});

function sendRequest(args) {
  return send(args).then(resp => {
    if (!resp.body.success) {
      throw new Error(resp.body.error);
    }
    return resp.body.result;
  });
}

function putResource({url, type, value}) {
  return sendRequest({
    command: `resource/${encodeURIComponent(url)}`,
    data: new window.frameElement.ownerDocument.defaultView.Blob([value]), // yucky! cypress uses socket.io to communicate between browser and node. In order to encode the data in binary format, socket.io checks for binary values. But `value instanceof Blob` is falsy since Blob from the cypress runner window is not the Blob from the command's window. So using the Blob from cypress runner window here.
    method: 'PUT',
    headers: {'Content-Type': type},
  });
}
