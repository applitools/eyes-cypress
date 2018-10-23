/* global Cypress,cy,window,before,after */
'use strict';
const poll = require('./poll');
const makeSend = require('./makeSend');
const {processDocument} = require('@applitools/visual-grid-client/browser');
const send = makeSend(Cypress.config('eyesPort'), cy.request);
const makeSendRequest = require('./sendRequest');
const makeEyesCheckWindow = require('./eyesCheckWindow');
const sendRequest = makeSendRequest(send);
const Blob = window.frameElement.ownerDocument.defaultView.Blob; // yucky! cypress uses socket.io to communicate between browser and node. In order to encode the data in binary format, socket.io checks for binary values. But `value instanceof Blob` is falsy since Blob from the cypress runner window is not the Blob from the command's window. So using the Blob from cypress runner window here.
const eyesCheckWindow = makeEyesCheckWindow({sendRequest, processDocument, Blob});

const openEyes = poll(function(data) {
  return sendRequest({command: 'open', data});
});

const batchEnd = poll(function({timeout}) {
  return sendRequest({command: 'batchEnd', data: {timeout}});
});

before(() => {
  sendRequest({command: 'batchStart'});
});

after(() => {
  return batchEnd({timeout: Cypress.config('eyesTimeout')});
});

Cypress.Commands.add('eyesOpen', function(args = {}) {
  const {title: testName} = this.currentTest || this.test;
  Cypress.log({name: 'Eyes: open'});
  return openEyes(Object.assign({testName}, args));
});

Cypress.Commands.add('eyesCheckWindow', args => {
  Cypress.log({name: 'Eyes: check window'});
  return cy.document({log: false}).then({timeout: 60000}, doc => eyesCheckWindow(doc, args));
});

Cypress.Commands.add('eyesClose', () => {
  Cypress.log({name: 'Eyes: close'});
  return sendRequest({command: 'close'});
});
