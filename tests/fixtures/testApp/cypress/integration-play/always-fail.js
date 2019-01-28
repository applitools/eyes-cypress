/* globals describe,it,cy,Cypress */
describe('always-fail', () => {
  it('always-fail', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test-iframe.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'failing app',
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
