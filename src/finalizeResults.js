function finalizeResults(results, eyesImpl) {
  // TODO Promise.all on results, then close session
  // TODO print something and fail on errors
  return Promise.all(results).then(() => {
    eyesImpl.close();
  });
}

module.exports = finalizeResults;
