describe('eyes.cypress', () => {
  it('runs', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen('some app', 'cypress-pack', {width: 1024, height: 768});
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
