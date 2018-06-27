function poll(doWork) {
  function doPoll(args) {
    return new Promise((resolve, reject) => {
      doWork(args)
        .then(result => {
          console.log('result', result);
          if (result.status === 'WIP' || result.status === 'IDLE') {
            setTimeout(() => {
              doPoll(args).then(results => resolve(results), err => reject(err));
            }, 1000);
          } else if (result.status === 'DONE') {
            resolve(result.results);
          } else {
            reject(result);
          }
        })
        .catch(ex => {
          reject(ex);
        });
    });
  }

  return doPoll;
}

module.exports = poll;
