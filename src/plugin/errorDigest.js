'use strict';

function errorDigest({testCount, testErrors, DiffsFoundError, logger}) {
  const diffErrors = testErrors.filter(err => err instanceof DiffsFoundError);
  const exceptions = testErrors.filter(err => !(err instanceof DiffsFoundError));
  logger.log('errorDigest: diff errors', diffErrors);
  logger.log('errorDigest: test errors', exceptions);

  return `
  Passed - ${testCount - testErrors.length} tests.
  Diffs detected - ${diffErrors.length} tests.${errorToString(diffErrors)}
  Errors - ${exceptions.length} tests.${errorToString(exceptions)}`;
}

function errorToString(errors) {
  return errors.length
    ? `\n\t\t\t${errors.map((err, i) => `${i + 1}) ${err}`).join('\n\t\t\t')}`
    : '';
}

module.exports = errorDigest;
