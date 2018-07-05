/* global Cypress,cy,window */
'use strict';
const extractResources = require('../render-grid/browser-util/extractResources');
const domNodesToCdt = require('../render-grid/browser-util/domNodesToCdt');
const poll = require('./poll');
const makeSend = require('./makeSend');
const port = Cypress.config('eyesPort') || require('./plugin/defaultPort');
const send = makeSend(port, cy.request);

const EyesServer = {
  open(args) {
    return sendRequest({command: 'open', data: args});
  },

  putResource({url, type, value}) {
    return sendRequest({
      command: `resource/${url}`,
      data: new window.frameElement.ownerDocument.defaultView.Blob([value]), // yucky! cypress uses socket.io to communicate between browser and node. In order to encode the data in binary format, socket.io checks for binary values. But `value instanceof Blob` is falsy since Blob from the cypress runner window is not the Blob from the command's window. So using the Blob from cypress runner window here.
      method: 'PUT',
      headers: {'Content-Type': type},
    });
  },

  checkWindow({resourceUrls, blobs, cdt, tag, sizeMode}) {
    const blobData = blobs.map(({url, type}) => ({url, type}));
    return Promise.all(blobs.map(EyesServer.putResource)).then(() =>
      sendRequest({command: 'checkWindow', data: {resourceUrls, cdt, tag, sizeMode, blobData}}),
    );
  },

  close: poll(function({timeout}) {
    return sendRequest({command: 'close', data: {timeout}});
  }),
};

Cypress.Commands.add('eyesOpen', (args = {}) => {
  Cypress.log({name: 'Eyes: open'});
  return cy.window({log: false}).then(win => {
    const openArgs = Object.assign({url: win.location.href}, args);
    return EyesServer.open(openArgs);
  });
});

Cypress.Commands.add('eyesCheckWindow', args => {
  let tag, sizeMode;
  if (typeof args === 'string') {
    tag = args;
  } else if (typeof args === 'object') {
    tag = args.tag;
    sizeMode = args.sizeMode;
  }

  Cypress.log({name: 'Eyes: check window'});
  return cy.document({log: false}).then(doc =>
    cy.window().then(win => {
      const cdt = domNodesToCdt(doc);
      return extractResources(doc, win).then(({resourceUrls, blobs}) => {
        return EyesServer.checkWindow({resourceUrls, blobs, cdt, tag, sizeMode});
      });
    }),
  );
});

Cypress.Commands.add('eyesClose', ({timeout} = {}) => {
  Cypress.log({name: 'Eyes: close'});
  return EyesServer.close({timeout});
});

function sendRequest(args) {
  return send(args).then(resp => {
    if (!resp.body.success) {
      throw new Error(resp.body.error);
    }
    return resp.body.result;
  });
}
