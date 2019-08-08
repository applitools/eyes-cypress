/* global describe, it, cy */

// Cypress.on('uncaught:exception', () => {});

describe('product-page-applitools', () => {
  it('Abra', () => {
    cy.visit('https://www.asos.com/river-island/river-island-button-cowl-neck-jumper/prd/1775492', {
      failOnStatusCode: false,
    });
    cy.wait(1000);
    cy.eyesOpen({
      appName: 'product-page-applitools',
    });
    cy.wait(1000);
    cy.eyesCheckWindow({
      tag: 'Abra pendant',
    });
    cy.eyesClose();
  });
});
