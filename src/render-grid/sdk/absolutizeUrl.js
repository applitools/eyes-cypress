'use strict';
const {URL} = require('url');

function absolutizeUrl(url, absoluteUrl) {
  return new URL(url, absoluteUrl).href;
}

module.exports = absolutizeUrl;
