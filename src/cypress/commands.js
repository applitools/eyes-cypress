/* global fetch, Cypress, cy */

const extractResources = require('../render-grid/browser-util/extractResources');
const domNodesToCdt = require('../render-grid/browser-util/domNodesToCdt');
const makeSend = require('./makeSend');
const send = makeSend(Cypress.config('eyesPort'), fetch)
  .then(resp => resp.text())
  .then(text => console.log('server answered', text));

const EyesServer = {
  open(url, appName, testName, viewportSize) {
    return send('open', {url, appName, testName, viewportSize});
  },

  checkWindow(resourceUrls, cdt) {
    return send('checkWindow', {resourceUrls, cdt});
  },

  close() {
    return send('close');
  },
};

Cypress.Commands.add('eyesOpen', (appName, testName, viewportSize) => {
  return cy.window().then(win => {
    return EyesServer.open(win.location.href, appName, testName, viewportSize);
  });
});

// TODO get url from test somehow
Cypress.Commands.add('eyesCheckWindow', () => {
  cy.log('Eyes: checkWindow');
  return cy.document().then(doc => {
    const domNodes = [doc.documentElement];
    const cdt = domNodesToCdt(domNodes);
    const resourceUrls = extractResources(domNodes);
    return EyesServer.checkWindow(resourceUrls, cdt);
  });
});

Cypress.Commands.add('eyesClose', () => {
  cy.log('Eyes: close');
  EyesServer.close();
});
