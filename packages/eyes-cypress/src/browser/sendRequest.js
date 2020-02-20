'use strict';

function makeSendRequest(send) {
  return function sendRequest(args) {
    return send(args)
      .then(resp => resp.json())
      .then(body => {
        if (!body.success) {
          throw new Error(body.error);
        }
        return body.result;
      });
  };
}

module.exports = makeSendRequest;
