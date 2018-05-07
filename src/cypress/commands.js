/* global fetch, Cypress, cy */

const extractResources = require('../render-grid/browser-util/extractResources');
const domNodesToCdt = require('../render-grid/browser-util/domNodesToCdt');
const makeSend = require('./makeSend');
const send = makeSend(Cypress.config('eyesPort'), fetch);

const EyesServer = {
  open(url, appName, testName, viewportSize) {
    return this._send('open', {url, appName, testName, viewportSize});
  },

  checkWindow(resourceUrls, cdt) {
    return this._send('checkWindow', {resourceUrls, cdt});
  },

  close() {
    return this._send('close');
  },

  _send: function() {
    return send
      .apply(this, arguments)
      .then(resp => resp.text())
      .then(text => console.log('server answered', text));
  },
};

Cypress.Commands.add('eyesOpen', (appName, testName, viewportSize) => {
  // TODO: this causes cypress to throw an error that I don't understand: cy.log('Eyes: open');
  return cy.window().then(win => {
    return EyesServer.open(win.location.href, appName, testName, viewportSize);
  });
});

// TODO get url from test somehow
Cypress.Commands.add('eyesCheckWindow', () => {
  cy.log('Eyes: checkWindow'); // TODO so why doesn't this throw an error?
  return cy.document().then(doc => {
    const {documentElement} = doc;
    const cdt = domNodesToCdt([documentElement]);
    const resourceUrls = extractResources(documentElement);
    return EyesServer.checkWindow(resourceUrls, cdt);
  });
});

Cypress.Commands.add('eyesClose', () => {
  // TODO: this causes cypress to throw an error that I don't understand: cy.log('Eyes: close');
  return EyesServer.close();
});
