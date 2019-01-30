const {TestResultsFormatter} = require('@applitools/eyes-sdk-core');
const {resolve} = require('path');
const {promisify} = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);

const makeHandleBatchResultsFile = config => {
  if (!config.tapDirPath) return () => {};
  return async function handleBatchResultsFile(results) {
    const formatter = new TestResultsFormatter(results);
    const tapFilePath = resolve(config.tapDirPath, 'eyes.tap');
    await writeFile(tapFilePath, formatter.asHierarchicTAPString(false, true));
  };
};

module.exports = makeHandleBatchResultsFile;
