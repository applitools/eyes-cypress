'use strict';
const {describe, it, afterEach} = require('mocha');
const {expect} = require('chai');
const fetch = require('node-fetch');
const {promisify: p} = require('util');
const {startApp} = require('../../../src/plugin/app');
const psetTimeout = p(setTimeout);

function listen(app) {
  return new Promise(resolve => {
    const server = app.listen(0, () => {
      resolve({
        port: server.address().port,
        close: server.close.bind(server),
      });
    });
  });
}

describe('app', () => {
  let close;
  afterEach(async () => {
    await close();
  });
  it('handles cors', async () => {
    const app = await startApp();
    const server = await listen(app);
    const {port} = server;
    close = server.close;
    const resp = await fetch(`http://localhost:${port}/hb`);
    expect(resp.status).to.equal(200);
    expect(resp.headers.get('access-control-allow-origin')).to.equal('*');
  });

  it('handles resource', async () => {
    let _id, _buffer;
    const app = await startApp({
      handlers: {
        putResource: (id, buffer) => {
          _id = id;
          _buffer = buffer;
        },
      },
    });

    const server = await listen(app);
    const {port} = server;
    close = server.close;
    const resp = await fetch(`http://localhost:${port}/eyes/resource/bla`, {
      method: 'PUT',
      body: JSON.stringify({data: 'blablabla'}),
    });

    expect(resp.status).to.equal(200);

    const json = await resp.json();

    expect(json).to.eql({success: true});
    expect(_id).to.equal('bla');
    expect(_buffer).to.eql(Buffer.from('blablabla'));
  });

  it('handles error in resource', async () => {
    const app = await startApp({
      handlers: {
        putResource: () => {
          throw new Error('putResource');
        },
      },
    });

    const server = await listen(app);
    const {port} = server;
    close = server.close;
    const resp = await fetch(`http://localhost:${port}/eyes/resource/bla`, {
      method: 'PUT',
      body: JSON.stringify({data: 'blablabla'}),
    });

    expect(resp.status).to.equal(200);

    const json = await resp.json();

    expect(json).to.eql({success: false, error: 'putResource'});
  });

  it('handles encoded resource URI', async () => {
    let _id, _buffer;
    const app = await startApp({
      handlers: {
        putResource: (id, buffer) => {
          _id = id;
          _buffer = buffer;
        },
      },
    });

    const server = await listen(app);
    const {port} = server;
    close = server.close;
    const str = 'hello!@#$%|world';
    const resp = await fetch(`http://localhost:${port}/eyes/resource/${encodeURIComponent(str)}`, {
      method: 'PUT',
      body: JSON.stringify({data: 'blablabla'}),
    });

    expect(resp.status).to.equal(200);

    const json = await resp.json();

    expect(json).to.eql({success: true});
    expect(_id).to.equal(str);
    expect(_buffer).to.eql(Buffer.from('blablabla'));
  });

  it('handles eyes command', async () => {
    let _args;
    const app = await startApp({
      handlers: {
        bla: async args => {
          _args = args;
          return args;
        },
      },
    });

    const server = await listen(app);
    const {port} = server;
    close = server.close;

    const baseUrl = `http://localhost:${port}/eyes`;

    const data = {data: 'blablabla'};
    const resp = await fetch(`${baseUrl}/bla`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(resp.status).to.equal(200);

    const json = await resp.json();

    expect(_args).to.eql(data);
    expect(json).to.eql({success: true, result: data});
  });

  it('handles error in eyes command', async () => {
    let _args;
    const app = await startApp({
      handlers: {
        err: async () => {
          await psetTimeout(0);
          throw new Error('bla');
        },
      },
    });

    const server = await listen(app);
    const {port} = server;
    close = server.close;

    const baseUrl = `http://localhost:${port}/eyes`;

    const data = {data: 'blablabla'};
    const resp = await fetch(`${baseUrl}/err`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(resp.status).to.equal(200);

    const json = await resp.json();

    expect(json).to.eql({success: false, error: 'bla'});
  });
});
