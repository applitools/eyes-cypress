/* globals describe,it,cy */

Cypress.on('uncaught:exception', () => {});
const url = 'https://www.asos.com/river-island/river-island-button-cowl-neck-jumper/prd/1775492';
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
