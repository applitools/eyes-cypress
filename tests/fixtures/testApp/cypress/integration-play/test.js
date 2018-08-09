/* globals describe,it,cy,Cypress */
describe('eyes.cypress', () => {
  Cypress.config('eyesTimeout', 100);
  it('runs', () => {
    cy.setCookie('auth', 'secret');
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-play-test',
      browser: {width: 1024, height: 768},
      showLogs: true,
      // saveDebugData: true,
    });
    cy.eyesCheckWindow({
      tag: 'full page',
      scriptHooks: {
        beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'",
      },
    });
    cy.eyesCheckWindow({tag: 'selector', sizeMode: 'selector', selector: '.region'});
    cy.get('.absolutely').then($el => {
      const {left, top, width, height} = $el[0].getBoundingClientRect();
      cy.eyesCheckWindow({
        tag: 'region',
        sizeMode: 'region',
        region: {left, top, width, height},
      });
    });
    cy.eyesClose();
  });
});
