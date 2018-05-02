/* global describe, it, cy, Cypress */

describe('check', () => {
  it('checks something', () => {
    const url = `http://localhost:${Cypress.config('eyesPort')}/example/test.html`;
    cy.visit(url);
    cy.eyesOpen('some app', 'some test', {width: 1024, height: 768});
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
