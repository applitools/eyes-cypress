'use strict';

function makeSendRequest(send) {
  return function sendRequest(args) {
    return send(args).then(resp => {
      if (!resp.body.success) {
        throw new Error(resp.body.error);
      }
      return resp.body.result;
    });
  };
}

module.exports = makeSendRequest;
