/* globals describe,it,cy */

const url = 'https://applitools.github.io/demo/TestPages/SimpleTestPage/';
const testName = url;

describe('Hello world', () => {
  it('works', () => {
    cy.eyesOpen({
      appName: 'CypressPlay',
      testName: testName,
      browser: [{width: 800, height: 600, name: 'chrome'}],
    });
    cy.visit(url);

    cy.eyesCheckWindow({
      tag: 'Play Check',
      saveCdt: false,
    });

    cy.eyesClose();
  });
});
