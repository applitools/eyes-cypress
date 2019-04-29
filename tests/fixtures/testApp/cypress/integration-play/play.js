/* globals describe,it,cy */

const url = 'https://applitools.github.io/demo/TestPages/SimpleTestPage/';
const testName = url;

describe('Hello world', () => {
  it('works', () => {
    cy.eyesOpen({
      appName: 'CypressPlay',
      testName: testName,
      browser: [
        {
          deviceName: 'iPhone X',
          screenOrientation: 'landscape',
          // width: 812,
          // height: 375,
        },
        {
          deviceName: 'iPad',
          screenOrientation: 'landscape',
          // width: 812,
          // height: 375,
        },
      ],
    });
    cy.visit(url);

    cy.eyesCheckWindow({
      tag: 'Play Check',
      saveCdt: false,
    });

    cy.eyesClose();
  });
});
