import expect = require('expect.js');


import { foo } from '../../src/dummy';

import {
  ServiceManager, ServerConnection
} from '@jupyterlab/services';

import {
  jupyterSessionConnect
} from '../../src/levelled-files/level-1/jupyter-session-connect';

describe('a test', () => {
  it('should do something', () => {
    expect(true).to.equal(true)
  })
  it('should do something else', () => {
    expect('string').to.equal('string')
  })
})

describe('dummy', () => {
  it('should be bar' , () => {
    expect(foo()).to.equal('bar')
  })
})

describe('Jupyter session connect', () => {
  const settings = ServerConnection.makeSettings()
  let serviceManager = new ServiceManager({
    serverSettings: settings
  });

  it('should create a new session', () => {
    return jupyterSessionConnect(serviceManager, 'new.md', [])
    .then(results => {
      expect(results.session.id).to.be.a('string')
      return expect(results.isNewSession).to.equal(true)
    })
    .then(() => {
      return jupyterSessionConnect(serviceManager, 'another_new.md', [])
    })
    .then(results => {
      return expect(results.isNewSession).to.equal(true)
    })
  })

  it('should find already created sessions', () => {
    return jupyterSessionConnect(serviceManager, 'duplicate.md', [])
    .then(results => {
      return jupyterSessionConnect(serviceManager, 'duplicate.md', [])
    })
    .then(results => {
      expect(results.isNewSession).to.equal(false)
    })
  })
})