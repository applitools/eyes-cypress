/* globals describe,it,cy */
describe('random play', () => {
  it('random play', () => {
    cy.visit('https://theintercept.com/privacy-policy/');

    // const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    // cy.visit(url);

    cy.eyesOpen({
      appName: 'cypress play around',
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
