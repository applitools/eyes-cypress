/* globals describe,it,cy */

const urls = [
  'https://facebook.com',
  'https://twitter.com',
  'https://wikipedia.org',
  'https://www.target.com/c/blankets-throws/-/N-d6wsb?lnk=ThrowsBlankets%E2%80%9C,tc',
  'https://docs.microsoft.com/en-us/',
  'https://applitools.com/features/frontend-development',
  'https://applitools.com/docs/topics/overview.html',
  'https://applitools.com/helloworld',
  'https://docs.cypress.io/api/api/table-of-contents.html',
  'https://docs.approvesimple.com/docs',
];

describe('Sanity', () => {
  for (let url of urls) {
    it(`Sanity - ${url}`, () => {
      cy.visit(url);
      cy.wait(3000);
      cy.eyesOpen({
        appName: 'SanityWeb',
        testName: `Sanity - ${url}`,
      });

      cy.eyesCheckWindow({
        tag: 'Sanity Load',
        saveCdt: false,
      });

      cy.eyesClose();
    });
  }
});
