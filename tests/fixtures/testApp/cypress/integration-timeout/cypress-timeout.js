describe('eyes.cypress', () => {
  it('runs', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen('some app', 'some test', {width: 1024, height: 768});
    cy.eyesCheckWindow({timeout: 100}); // this very small timeout should make the test fail
    cy.eyesClose();
  });
});
