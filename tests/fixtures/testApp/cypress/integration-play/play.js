/* globals describe,it,cy,Cypress */

Cypress.on('uncaught:exception', () => {});
const url = 'https://google.com';
const testName = url;

describe('Hello world', () => {
  it('works', () => {
    cy.visit(url, {failOnStatusCode: false});
    cy.wait(5000);
    cy.eyesOpen({
      appName: 'CypressPlay',
      testName: testName,
    });

    cy.eyesCheckWindow({
      tag: 'Play Check',
    });

    cy.eyesClose();
  });
});
