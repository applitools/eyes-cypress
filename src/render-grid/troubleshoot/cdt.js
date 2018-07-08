// 'use strict';

// function cdtToHtml(cdt) {
//   function nodeToString(node) {
//     if (node.nodeType === 1) {
//       let htmlStr = '';
//       htmlStr += `<${node.nodeName}`;
//       if (node.attributes) {
//         const attrStr = node.attributes.map(attr => `${attr.name}=${attr.value}`).join(' ');
//         htmlStr += ` ${attrStr}`;
//       }
//       htmlStr += '>';
//       const childNodesStr = childNodeIndexesToString(node.childNodeIndexes);
//       htmlStr += childNodesStr;
//       htmlStr += `</${node.nodeName}>`;
//       return htmlStr;
//     } else if (node.nodeType === 3) {
//       return node.nodeValue;
//     }
//   }

//   function childNodeIndexesToString(indexes) {
//     return indexes.map(index => nodeToString(cdt[index])).join('');
//   }

//   const doc = cdt.find(node => node.nodeType === 9);
//   return childNodeIndexesToString(doc.childNodeIndexes);
// }

// module.exports = cdtToHtml;

'use strict';
const {URL} = require('url');
const {extension} = require('mime-types');
const {encode} = require('he');

const NODE_TYPE_ELEMENT = 1;
const NODE_TYPE_TEXT = 3;
const NODE_TYPE_COMMENT = 8;
const NODE_TYPE_DOCUMENT = 9;
const NODE_TYPE_DOCUMENT_TYPE = 10;

function renderDomNodesToHtml(domNodes) {
  const renderChildren = (domNodes, node) =>
    (node.childNodeIndexes || []).reduce(
      (acc, childNodeIndex) => acc + renderCdtDomNode(domNodes, childNodeIndex),
      '',
    );

  const renderAttribute = ({name, value}) => `${name}="${encode(value)}"`;

  const renderAttributes = ({attributes}) =>
    attributes ? attributes.map(attr => renderAttribute(attr)).join(' ') : '';

  function renderCdtDomNode(domNodes, nodeIndex) {
    const node = domNodes[nodeIndex];

    switch (node.nodeType) {
      case NODE_TYPE_DOCUMENT:
        return renderChildren(domNodes, node);
      case NODE_TYPE_ELEMENT:
        return `<${node.nodeName} ${renderAttributes(node)}>${renderChildren(domNodes, node)}</${
          node.nodeName
        }>`;
      case NODE_TYPE_TEXT:
        return encode(node.nodeValue);
      case NODE_TYPE_COMMENT:
        return `<!--${node.nodeValue}-->`;
      case NODE_TYPE_DOCUMENT_TYPE:
        return `<!DOCTYPE ${node.nodeName}>`;
      default:
        return '';
    }
  }

  if (!domNodes) return '';
  return renderCdtDomNode(domNodes, 0);
}

function createAbsolutizedDomNodes(domNodes, resources, baseUrl) {
  const absolutizAttribute = (attribute, baseUrl) => {
    if (attribute.name === 'src' || attribute.name == 'href') {
      const link = attribute.value;
      const url = new URL(link, baseUrl);
      const resource = resources[url.href];
      if (resource) {
        const value = getResourceName(resource);
        return Object.assign({}, attribute, {value});
      } else {
        return attribute;
      }
    } else {
      return attribute;
    }
  };

  const absolutizeAttributes = (node, baseUrl) =>
    node.attributes && node.attributes.map(attr => absolutizAttribute(attr, baseUrl));

  const absolutizeChildren = (domNodes, node, {baseUrl}) =>
    node.childNodeIndexes &&
    node.childNodeIndexes.forEach(index => absolutizeDomNodes(domNodes, index, {baseUrl}));

  function absolutizeDomNodes(domNodes, nodeIndex, {baseUrl: originBaseUrl}) {
    const node = domNodes[nodeIndex];
    const baseUrl = node.baseUrl || originBaseUrl;

    if (node.nodeType === NODE_TYPE_ELEMENT || node.nodeType === NODE_TYPE_DOCUMENT) {
      newDomNodes[nodeIndex] = Object.assign({}, node, {
        attributes: absolutizeAttributes(node, baseUrl),
      });

      absolutizeChildren(domNodes, node, {baseUrl});
    }
  }

  if (!domNodes || !domNodes.length) return domNodes;

  const newDomNodes = [...domNodes];

  absolutizeDomNodes(domNodes, 0, {baseUrl});

  return newDomNodes;
}

function getFileExtension(contentType) {
  let fileExtension = extension(contentType);

  // NOTE: this is because of missing mime type(s) in the `mime-db` package. Patching more missing types should be done inside this `if` statement.
  if (!fileExtension) {
    if (contentType === 'application/font-woff2') {
      fileExtension = 'woff2';
    } else if (contentType === 'application/x-font-ttf') {
      fileExtension = 'ttf';
    }
  }

  return fileExtension;
}

function getResourceName(resource) {
  const sha256 = resource.getSha256Hash();
  const fileExtension = getFileExtension(resource.getContentType());
  return `${sha256}.${fileExtension}`;
}

module.exports = {
  getResourceName,
  renderDomNodesToHtml,
  createAbsolutizedDomNodes,
};
