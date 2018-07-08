'use strict';

function createResourceCache() {
  function add(key, entry, dependencies) {
    cache[key] = {value: entry, dependencies};
  }

  function getWithDependencies(key) {
    const entry = cache[key];
    if (!entry) return;

    const ret = {};
    ret[key] = entry.value;
    if (entry.dependencies) {
      entry.dependencies.forEach(dep => {
        Object.assign(ret, getWithDependencies(dep));
      });
    }
    return ret;
  }

  const cache = {};

  return {
    add,
    getWithDependencies,
  };
}

module.exports = createResourceCache;
