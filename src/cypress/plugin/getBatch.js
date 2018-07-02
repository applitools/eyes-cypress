'use strict';
const {BatchInfo} = require('@applitools/eyes.sdk.core');

function getBatch({batchName, batchId}) {
  const batchInfo = new BatchInfo(batchName, null, batchId);

  return {
    batchName: batchInfo.getName(),
    batchId: batchInfo.getId(),
  };
}

module.exports = getBatch;
