const {expect} = require('chai');
const {JSDOM} = require('jsdom');
const domNodesToCdt = require('../src/client/domNodesToCdt');
const {NODE_TYPES} = domNodesToCdt;

function getElementNodes(htmlStr) {
  const dom = new JSDOM(htmlStr);
  return [dom.window.document.documentElement];
}

describe('domNodesToCdt', () => {
  it('works for DOM with 1 element', () => {
    const elementNodes = getElementNodes('<div style="color:red;">hello</div>');
    const cdt = domNodesToCdt(elementNodes);
    const expected = [
      {
        nodeType: NODE_TYPES.DOCUMENT,
        childNodeIndexes: [5],
      },
      {
        nodeType: NODE_TYPES.ELEMENT,
        nodeName: 'HEAD',
        attributes: [],
        childNodeIndexes: [],
      },
      {
        nodeType: NODE_TYPES.TEXT,
        nodeValue: 'hello',
      },
      {
        nodeType: NODE_TYPES.ELEMENT,
        nodeName: 'DIV',
        childNodeIndexes: [2],
        attributes: [{ name: 'style', value: 'color:red;'}],
      },
      {
        nodeType: NODE_TYPES.ELEMENT,
        nodeName: 'BODY',
        childNodeIndexes: [3],
        attributes: [],
      },
      {
        nodeType: NODE_TYPES.ELEMENT,
        nodeName: 'HTML',
        attributes: [],
        childNodeIndexes: [1, 4],
      },
    ];
    expect(cdt).to.deep.equal(expected);
  });
});
