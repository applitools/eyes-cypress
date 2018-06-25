describe('eyes.cypress', () => {
  it('runs', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({ appName: 'some app', testName: 'cypress-pack', viewportSize: {width: 1024, height: 768}, showLogs: true});
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
