/* global describe, it, cy, Cypress */
Cypress.on('uncaught:exception', () => {});

describe('Play Cypress', () => {
  it('Play Cypress', () => {
    cy.visit('https://wix.com', {
      failOnStatusCode: false,
    });
    cy.eyesOpen({
      appName: 'Play Cypress',
    });
    cy.eyesCheckWindow({
      tag: 'Play Cypress',
    });
    cy.eyesClose();
  });
});
