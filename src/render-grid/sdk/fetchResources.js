const {keyBy} = require('lodash');
const fetchResource = require('./fetchResource');

module.exports = urls => {
  const promises = urls.map(fetchResource);
  return Promise.all(promises).then(resourceContents => keyBy(resourceContents, 'url'));
};
