/* global fetch, Cypress, cy */

const extractResources = require('../render-grid/browser-util/extractResources');
const domNodesToCdt = require('../render-grid/browser-util/domNodesToCdt');
const makeSend = require('./makeSend');
const send = makeSend(Cypress.config('eyesPort') || require('./defaultPort'), fetch);

const EyesServer = {
  open(args) {
    return this._send('open', args).catch(ex => {
      if (ex.message === 'Failed to fetch') {
        throw new Error(
          "Eyes.Cypress communication failure. Maybe you used a custom plugin port and didn't export it as eyesPort from the pluginsFile? Check your pluginsFile (normally located at cypress/plugins/index.js) for the require('@applitools/eyes.cypress') statement.",
        );
      } else {
        throw ex;
      }
    });
  },

  checkWindow(resourceUrls, cdt, tag) {
    return this._send('checkWindow', {resourceUrls, cdt, tag});
  },

  close({timeout}) {
    return this._send('close', {timeout});
  },

  _send: function(command, data) {
    let resp;
    return send(command, data)
      .then(_resp => {
        resp = _resp;
        return resp.text();
      })
      .then(text => {
        if (resp.status === 500) {
          return Promise.reject(text);
        }
      });
  },
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
