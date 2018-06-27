/* global fetch, Cypress, cy */

const extractResources = require('../render-grid/browser-util/extractResources');
const domNodesToCdt = require('../render-grid/browser-util/domNodesToCdt');
const poll = require('./poll');
const makeSend = require('./makeSend');
const port = Cypress.config('eyesPort') || require('./plugin/defaultPort');
const send = makeSend(port, fetch);

const EyesServer = {
  open(args) {
    return sendRequest('open', args).catch(ex => {
      if (ex.message === 'Failed to fetch') {
        throw new Error(
          `Eyes.Cypress communication failure. Configured eyesPort is ${port}. Maybe you used a custom plugin port and didn't export it as eyesPort from the pluginsFile? Check your pluginsFile (normally located at cypress/plugins/index.js) for the require('@applitools/eyes.cypress') statement.`,
        );
      } else {
        throw ex;
      }
    });
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
  return EyesServer.close({timeout}).catch(ex => {
    console.log('bbb', ex);
  });
});

function sendRequest(command, data) {
  let resp;
  return send(command, data)
    .then(_resp => {
      resp = _resp;
      if (resp.status === 500) {
        return resp.text();
      } else {
        return resp.json();
      }
    })
    .then(result => {
      if (resp.status === 500) {
        return Promise.reject(result);
      }
      return result;
    });
}
