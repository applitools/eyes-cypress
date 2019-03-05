/* globals describe,it,cy,Cypress */
describe('eyes-cypress', () => {
  it('cypress-run-iframe-autodesk', () => {
    cy.setCookie('auth', 'secret');
    const url = `http://localhost:${Cypress.config('testPort')}/test-iframe.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
