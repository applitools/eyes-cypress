describe('eyes.cypress', () => {
  it('runs', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({ appName: 'some app', testName: 'cypress-timeout', viewportSize: {width: 1024, height: 768}, isVerbose: true});
    cy.eyesCheckWindow();
    cy.eyesClose({timeout: 100}); // this very small timeout should make the test fail
  });
});
