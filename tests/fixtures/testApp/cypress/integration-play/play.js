/* globals describe,it,cy */
describe('random play', () => {
  it('random play', () => {
    cy.visit('http://localhost:3000');

    // const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    // cy.visit(url);

    cy.eyesOpen({
      appName: 'cypress play around',
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
