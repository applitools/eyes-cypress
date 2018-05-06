const {uniq, flatten} = require('lodash');

module.exports = domNodes => {
  const imgUrls = uniq(
    flatten(
      domNodes.map(el =>
        Array.from(el.querySelectorAll('img')).map(img => img.getAttribute('src')),
      ),
    ),
  );

  const cssUrls = uniq(
    flatten(
      domNodes.map(el =>
        Array.from(el.querySelectorAll('link[rel="stylesheet"]')).map(link =>
          link.getAttribute('href'),
        ),
      ),
    ),
  );

  return [...imgUrls, ...cssUrls];
};
