/* globals describe,it,cy,Cypress */
describe('eyes.cypress', () => {
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
    cy.eyesCheckWindow('full page');
    cy.eyesCheckWindow({tag: 'selector', sizeMode: 'selector', selector: '.region'});
    cy.get('.absolutely').then($el => {
      const {left, top, width, height} = $el[0].getBoundingClientRect();
      console.log({left, top, width, height});
      cy.eyesCheckWindow({
        tag: 'region',
        sizeMode: 'region',
        region: {left, top, width, height},
      });
    });
    cy.eyesClose();
  });
});
