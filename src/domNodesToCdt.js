/* eslint-disable no-use-before-define */
const NODE_TYPES = {
  ELEMENT: 1,
  TEXT: 3,
  DOCUMENT: 9,
  DOCUMENT_TYPE: 10,
};

function domNodesToCdt(elementNodes) {
  const domNodes = [
    {
      nodeType: NODE_TYPES.DOCUMENT,
    },
  ];
  domNodes[0].childNodeIndexes = childrenFactory(domNodes, elementNodes);
  return domNodes;
}

const childrenFactory = (domNodes, elementNodes) => {
  if (!elementNodes || elementNodes.length === 0) return null;

  const childIndexes = [];
  elementNodes.forEach(elementNode => {
    const index = elementNodeFactory(domNodes, elementNode);
    childIndexes.push(index);
  });

  return childIndexes;
};

const elementNodeFactory = (domNodes, elementNode) => {
  let node;
  if (elementNode.nodeType === NODE_TYPES.ELEMENT) {
    node = {
      nodeType: NODE_TYPES.ELEMENT,
      nodeName: elementNode.nodeName,
      attributes: Object.keys(elementNode.attributes).map(key => ({
        name: elementNode.attributes[key].localName,
        value: elementNode.attributes[key].value,
      })),
      childNodeIndexes: elementNode.childNodes.length
        ? childrenFactory(domNodes, elementNode.childNodes)
        : [],
    };
  } else if (elementNode.nodeType === NODE_TYPES.TEXT) {
    node = {
      nodeType: NODE_TYPES.TEXT,
      nodeValue: elementNode.nodeValue,
    };
  } else if (elementNode.nodeType === NODE_TYPES.DOCUMENT) {
    node = {
      nodeType: NODE_TYPES.DOCUMENT_TYPE,
      nodeName: 'HTML',
    };
  } else {
    throw new Error(`Unknown nodeType: ${elementNode.nodeType}`);
  }

  domNodes.push(node);
  return domNodes.length - 1;
};

module.exports = domNodesToCdt;
module.exports.NODE_TYPES = NODE_TYPES;
