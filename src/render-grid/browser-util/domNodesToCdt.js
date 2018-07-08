/* eslint-disable no-use-before-define */
'use strict';
const NODE_TYPES = {
  ELEMENT: 1,
  TEXT: 3,
  DOCUMENT: 9,
  DOCUMENT_TYPE: 10,
};

function domNodesToCdt(docNode) {
  const domNodes = [
    {
      nodeType: NODE_TYPES.DOCUMENT,
    },
  ];
  domNodes[0].childNodeIndexes = childrenFactory(domNodes, docNode.childNodes);
  return domNodes;
}

const childrenFactory = (domNodes, elementNodes) => {
  if (!elementNodes || elementNodes.length === 0) return null;

  const childIndexes = [];
  elementNodes.forEach(elementNode => {
    const index = elementNodeFactory(domNodes, elementNode);
    if (index !== null) {
      childIndexes.push(index);
    }
  });

  return childIndexes;
};

const elementNodeFactory = (domNodes, elementNode) => {
  let node;
  const {nodeType} = elementNode;
  if (nodeType === NODE_TYPES.ELEMENT) {
    if (elementNode.nodeName !== 'SCRIPT') {
      node = {
        nodeType: NODE_TYPES.ELEMENT,
        nodeName: elementNode.nodeName,
        attributes: Object.keys(elementNode.attributes).map(key => {
          let value = elementNode.attributes[key].value;
          const name = elementNode.attributes[key].localName;

          if (/^blob:/.test(value)) {
            value = value.replace(/^blob:http:\/\/localhost:\d+\/(.+)/, '$1'); // TODO don't replace localhost once render-grid implements absolute urls
          }

          return {
            name,
            value,
          };
        }),
        childNodeIndexes: elementNode.childNodes.length
          ? childrenFactory(domNodes, elementNode.childNodes)
          : [],
      };
    }
  } else if (nodeType === NODE_TYPES.TEXT) {
    node = {
      nodeType: NODE_TYPES.TEXT,
      nodeValue: elementNode.nodeValue,
    };
  } else if (nodeType === NODE_TYPES.DOCUMENT_TYPE) {
    node = {
      nodeType: NODE_TYPES.DOCUMENT_TYPE,
      nodeName: elementNode.nodeName,
    };
  }

  if (node) {
    domNodes.push(node);
    return domNodes.length - 1;
  } else {
    // console.log(`Unknown nodeType: ${nodeType}`);
    return null;
  }
};

module.exports = domNodesToCdt;
module.exports.NODE_TYPES = NODE_TYPES;
