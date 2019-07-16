/* global describe, it, cy */

Cypress.on('uncaught:exception', () => {});

describe('product-page-applitools', () => {
  it('Abra', () => {
    cy.visit('https://www.turncar.com/', {failOnStatusCode: false});
    cy.wait(1000);
    cy.eyesOpen({
      appName: 'product-page-applitools',
      browser: {width: 1024, height: 768, name: 'chrome'},
    });
    cy.eyesCheckWindow({
      tag: 'Abra pendant',
    });
    cy.eyesClose();
  });
});
