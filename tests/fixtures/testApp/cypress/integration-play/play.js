/* global describe, it, cy */

describe('product-page-applitools', () => {
  it('Abra', () => {
    cy.visit('https://ous.test.clper.me/app/login', {failOnStatusCode: false});
    cy.wait(7000);
    cy.eyesOpen({
      appName: 'product-page-applitools',
      browser: {width: 1024, height: 768, name: 'chrome'},
    });
    cy.eyesCheckWindow({
      tag: 'Abra pendant',
      // scriptHooks: {
      //   beforeCaptureScreenshot: 'new Promise(r => setTimeout(r, 3000));',
      // },
    });
    cy.eyesClose();
  });
});
