/* global fetch, Cypress, cy */

const extractResources = require('../render-grid/browser-util/extractResources');
const domNodesToCdt = require('../render-grid/browser-util/domNodesToCdt');
const makeSend = require('./makeSend');
const send = makeSend(Cypress.config('eyesPort') || require('./defaultPort'), fetch);

const EyesServer = {
  open(url, appName, testName, viewportSize) {
    return this._send('open', {url, appName, testName, viewportSize});
  },

  checkWindow(resourceUrls, cdt, tag) {
    return this._send('checkWindow', {resourceUrls, cdt, tag});
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
  Cypress.log({name: 'Eyes: open'});
  return cy.window({log: false}).then(win => {
    return EyesServer.open(win.location.href, appName, testName, viewportSize);
  });
});

Cypress.Commands.add('eyesCheckWindow', (tag, {timeout} = {}) => {
  Cypress.log({name: 'Eyes: check window'});
  return cy.document({log: false}).then({timeout: timeout || 60000}, doc => {
    const {documentElement} = doc;
    const cdt = domNodesToCdt([documentElement]);
    const resourceUrls = extractResources(documentElement);
    return EyesServer.checkWindow(resourceUrls, cdt, tag);
  });
});

Cypress.Commands.add('eyesClose', () => {
  Cypress.log({name: 'Eyes: close'});
  return EyesServer.close();
});
