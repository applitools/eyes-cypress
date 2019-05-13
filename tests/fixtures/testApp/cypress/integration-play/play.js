/* globals describe,it,cy */

const url = 'https://google.com/';
const testName = url;

describe('Hello world', () => {
  it('works', () => {
    cy.eyesOpen({
      appName: 'CypressPlay',
      testName: testName,
    });
    cy.visit(url);

    cy.eyesCheckWindow({
      tag: 'Play Check',
      saveCdt: false,
    });

    cy.eyesClose();
  });
});
