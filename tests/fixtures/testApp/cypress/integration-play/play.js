/* globals describe,it,cy */

const url = 'https://www.applitools.com/helloworld';
const testName = url
  .split('.')
  .reduce((acc, part, i, arr) => `${acc}${i !== 0 && i !== arr.length - 1 ? '.' + part : ''}`, '')
  .substr(1);

describe('Hello world', () => {
  it('works', () => {
    cy.eyesOpen({
      appName: 'CypressPlay',
      testName: testName,
    });
    cy.visit(url);

    cy.eyesCheckWindow({
      tag: 'Play Check',
    });

    cy.eyesClose();
  });
});
