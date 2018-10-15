'use strict';
function poll(doWork) {
  function doPoll(args) {
    return doWork(args).then(result => {
      if (result.status === 'WIP' || result.status === 'IDLE') {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            doPoll(args).then(results => resolve(results), err => reject(err));
          }, 1000);
        });
      } else if (result.status === 'DONE') {
        return result.results;
      } else {
        throw new Error(result);
      }
    });
  }

  return doPoll;
}

module.exports = poll;
