'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const {presult} = require('@applitools/functional-commons');
const processCloseAndAbort = require('../../../src/plugin/processCloseAndAbort');
const psetTimeout = require('util').promisify(setTimeout);

describe('processCloseAndAbort', () => {
  it('returns close result when no error was thrown', async () => {
    const runningTests = [{closePromise: presult(Promise.resolve('bla'))}];
    const testResults = await processCloseAndAbort(runningTests);
    expect(testResults).to.eql(['bla']);
  });

  it("returns abort results when there's no close promise", async () => {
    const runningTests = [
      {
        abort: async () => {
          await psetTimeout(50);
          return ['bla'];
        },
      },
    ];
    const testResults = await processCloseAndAbort(runningTests);
    expect(testResults).to.eql([['bla']]);
  });

  it('filters undefined abort results', async () => {
    const runningTests = [{abort: () => [undefined, 'bla', undefined]}];
    const testResults = await processCloseAndAbort(runningTests);
    expect(testResults).to.eql([['bla']]);
  });

  it('return filtered abort results with error when close throws an error', async () => {
    const error = new Error('bla');
    const runningTests = [
      {closePromise: presult(Promise.reject(error)), abort: () => [{aaa: 'aaa'}]},
    ];
    const testResults = await processCloseAndAbort(runningTests);
    expect(testResults).to.eql([[{aaa: 'aaa', error}]]);
  });

  it('all works together', async () => {
    const error = new Error('bla');
    const runningTests = [
      {closePromise: presult(Promise.resolve('bla'))},
      {
        abort: async () => {
          await psetTimeout(50);
          return ['bla'];
        },
      },
      {abort: () => [undefined, 'bla', undefined]},
      {closePromise: presult(Promise.reject(error)), abort: () => [{aaa: 'aaa'}]},
    ];

    const testResults = await processCloseAndAbort(runningTests);
    expect(testResults).to.eql(['bla', ['bla'], ['bla'], [{aaa: 'aaa', error}]]);
  });
});
