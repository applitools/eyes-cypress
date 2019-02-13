/* globals describe,it,cy */
describe('Hello world', () => {
  it('works', () => {
    cy.eyesOpen({
      appName: 'Oral',
      testName: 'gils test',
    });
    cy.visit('https://applitools.com/helloworld');

    cy.eyesCheckWindow({
      tag: 'Nearby times before click',
    });

    cy.eyesClose();
  });
});
