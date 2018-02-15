import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  Session, ServerConnection
} from '@jupyterlab/services';

import {
  ServiceManager
} from '@jupyterlab/services';

interface PromiseReturn {
  session: Session.ISession, 
  isNewSession: boolean
}

export function jupyterSessionConnect(
  serviceManager: ServiceManager, path: string, activeSessionIds: string[]
): Promise<PromiseReturn> {
  let resultsPromiseDelegate = new PromiseDelegate<PromiseReturn>();

  serviceManager.sessions.findByPath(path)
  .then(sessionModel => {
    serviceManager.sessions.connectTo(sessionModel)
    .then(session => {
      resultsPromiseDelegate.resolve({
        session, isNewSession: false
      })
    })
  })
  .catch(() => {
    connectToNewSession(serviceManager, path)
    .then(results => resultsPromiseDelegate.resolve(results))
  });

  return resultsPromiseDelegate.promise
}


function connectToNewSession(serviceManager: ServiceManager, path: string): Promise<PromiseReturn> {
  let promiseDelegate = new PromiseDelegate<PromiseReturn>();

  const settings = ServerConnection.makeSettings({});
  const startNewOptions = {
    kernelName: 'python3',
    serverSettings: settings,
    path: path
  };

  serviceManager.sessions.startNew(startNewOptions).then(session => {
    promiseDelegate.resolve({session, isNewSession: true})
  });

  return promiseDelegate.promise
}

