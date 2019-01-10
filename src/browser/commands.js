/* global Cypress,cy,window,before,after */
'use strict';
const poll = require('./poll');
const makeSend = require('./makeSend');
const processPage = require('@applitools/dom-capture/src/browser/visual-grid/processPage');
const send = makeSend(Cypress.config('eyesPort'), cy.request);
const makeSendRequest = require('./sendRequest');
const makeEyesCheckWindow = require('./eyesCheckWindow');
const sendRequest = makeSendRequest(send);
const Blob = window.frameElement.ownerDocument.defaultView.Blob; // yucky! cypress uses socket.io to communicate between browser and node. In order to encode the data in binary format, socket.io checks for binary values. But `value instanceof Blob` is falsy since Blob from the cypress runner window is not the Blob from the command's window. So using the Blob from cypress runner window here.
const eyesCheckWindow = makeEyesCheckWindow({sendRequest, processPage, Blob});

if (!Cypress.config('eyesIsDisabled')) {
  const batchEnd = poll(function({timeout}) {
    return sendRequest({command: 'batchEnd', data: {timeout}});
  });

  before(() => {
    sendRequest({command: 'batchStart'});
  });

  after(() => {
    return batchEnd({timeout: Cypress.config('eyesTimeout')});
  });
}

let isCurrentTestDisabled;

Cypress.Commands.add('eyesOpen', function(args = {}) {
  const {title: testName} = this.currentTest || this.test;
  Cypress.log({name: 'Eyes: open'});
  if (Cypress.config('eyesIsDisabled') && args.isDisabled === false) {
    throw new Error(
      `Eyes.Cypress is disabled by an env variable or in the applitools.config.js file, but the "${testName}" test was passed isDisabled:false. A single test cannot be enabled when Eyes.Cypress is disabled through the global configuration. Please remove "isDisabled:false" from cy.eyesOpen() for this test, or enable Eyes.Cypress in the global configuration, either by unsetting the APPLITOOLS_IS_DISABLED env var, or by deleting 'isDisabled' from the applitools.config.js file.`,
    );
  }
  isCurrentTestDisabled = Cypress.config('eyesIsDisabled') || args.isDisabled;
  if (isCurrentTestDisabled) return;
  return sendRequest({command: 'open', data: Object.assign({testName}, args)});
});

Cypress.Commands.add('eyesCheckWindow', args => {
  Cypress.log({name: 'Eyes: check window'});
  if (isCurrentTestDisabled) return;
  return cy.document({log: false}).then({timeout: 60000}, doc => eyesCheckWindow(doc, args));
});

Cypress.Commands.add('eyesClose', () => {
  Cypress.log({name: 'Eyes: close'});
  if (isCurrentTestDisabled) {
    isCurrentTestDisabled = false;
    return;
  }
  return sendRequest({command: 'close'});
});
