/* globals describe,it,cy */

const url = 'https://carbon.sage.com/components/button-toggle-group';
const testName = url;

describe('Hello world', () => {
  it('works', () => {
    cy.visit(url, {failOnStatusCode: false});
    cy.eyesOpen({
      appName: 'CypressPlay',
      testName: testName,
    });

    cy.eyesCheckWindow({
      tag: 'Play Check',
    });

    cy.eyesClose();
  });
});
