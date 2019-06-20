/* globals describe,it,cy,Cypress */

Cypress.on('uncaught:exception', () => {});
const url = 'https://cvshealth.com/';
const testName = url;

describe('Hello world', () => {
  it('works', () => {
    cy.visit(url, {failOnStatusCode: false});
    cy.wait(1000);
    cy.eyesOpen({
      appName: 'CypressPlay',
      testName: testName,
      browser: [{width: 1024, height: 768, name: 'chrome'}],
    });

    cy.eyesCheckWindow({
      tag: 'Play Check',
    });

    cy.eyesClose();
  });
});
