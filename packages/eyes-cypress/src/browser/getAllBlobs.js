'use strict';

function getAllBlobs(frame) {
  return uniq([
    ...frame.blobs,
    ...frame.frames.reduce((acc, frame) => [...acc, ...getAllBlobs(frame)], []),
  ]);
}

function uniq(arr) {
  return Array.from(new Set(arr)).filter(x => !!x);
}

module.exports = getAllBlobs;
