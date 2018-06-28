/* global Cypress, cy */

const extractResources = require('../render-grid/browser-util/extractResources');
const domNodesToCdt = require('../render-grid/browser-util/domNodesToCdt');
const poll = require('./poll');
const makeSend = require('./makeSend');
const port = Cypress.config('eyesPort') || require('./plugin/defaultPort');
const send = makeSend(port, cy.request);

const EyesServer = {
  open(args) {
    return sendRequest('open', args);
  },

  checkWindow(resourceUrls, cdt, tag) {
    return sendRequest('checkWindow', {resourceUrls, cdt, tag});
  },

  close: poll(function({timeout}) {
    return sendRequest('close', {timeout});
  }),
};

Cypress.Commands.add('eyesOpen', (args = {}) => {
  Cypress.log({name: 'Eyes: open'});
  return cy.window({log: false}).then(win => {
    const openArgs = Object.assign({url: win.location.href}, args);
    return EyesServer.open(openArgs);
  });
});

Cypress.Commands.add('eyesCheckWindow', tag => {
  Cypress.log({name: 'Eyes: check window'});
  return cy.document({log: false}).then(doc => {
    const cdt = domNodesToCdt(doc);
    const resourceUrls = extractResources(doc);
    return EyesServer.checkWindow(resourceUrls, cdt, tag);
  });
});

Cypress.Commands.add('eyesClose', ({timeout} = {}) => {
  Cypress.log({name: 'Eyes: close'});
  return EyesServer.close({timeout});
});

function sendRequest(command, data) {
  return send(command, data).then(resp => {
    if (!resp.body.success) {
      throw new Error(resp.body.error);
    }
    return resp.body.result;
  });
}
