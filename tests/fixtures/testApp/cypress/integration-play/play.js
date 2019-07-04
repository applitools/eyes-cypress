/* global describe, it, cy */

describe('product-page-applitools', () => {
  it('Abra', () => {
    cy.visit(
      'https://www.asos.com/asos-maternity-nursing/asos-design-maternity-nursing-sleeveless-smock-top-with-crochet-hem/prd/12263487?clr=ecru&colourWayId=16418082&SearchQuery=&cid=27108',
      {failOnStatusCode: false},
    );
    cy.wait(1000);
    cy.eyesOpen({
      appName: 'product-page-applitools',
      browser: {width: 1024, height: 768, name: 'chrome'},
    });
    cy.eyesCheckWindow({
      tag: 'Abra pendant',
    });
    cy.eyesClose();
  });
});
