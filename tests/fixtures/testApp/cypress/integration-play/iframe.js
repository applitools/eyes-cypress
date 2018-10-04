/* globals describe,it,cy,Cypress */
describe('eyes.cypress', () => {
  it('frames', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test-iframe.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-play-iframe5',
      browser: {width: 1024, height: 1920},
      showLogs: true,
    });
    cy.eyesCheckWindow({
      tag: 'full page',
    });
    cy.eyesClose();
  });
});
