/* global describe, it, cy */

describe('product-page-applitools', () => {
  it('Abra', () => {
    cy.visit('https://applitools.com/helloworld', {failOnStatusCode: false});
    cy.wait(1000);
    cy.eyesOpen({
      appName: 'product-page-applitools',
      browser: {width: 1024, height: 768, name: 'chrome'},
    });
    cy.eyesCheckWindow({
      target: 'region',
      selector: '.section',
      tag: 'Abra pendant',
    });
    cy.eyesClose();
  });
});
