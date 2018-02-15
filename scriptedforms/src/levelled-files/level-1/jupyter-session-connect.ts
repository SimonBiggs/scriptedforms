import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  Session, ServerConnection
} from '@jupyterlab/services';

import {
  ServiceManager
} from '@jupyterlab/services';

interface SessionFound {
  sessionModel: Session.IModel,
  isNewSession: boolean
}

interface PromiseReturn {
  session: Session.ISession, 
  isNewSession: boolean
}

export function jupyterSessionConnect(
  serviceManager: ServiceManager, path: string, activeSessionIds: string[]
): Promise<PromiseReturn> {
  let sessionFound = new PromiseDelegate<SessionFound>();
  let resultsPromiseDelegate = new PromiseDelegate<PromiseReturn>();

  serviceManager.sessions.findByPath(path)
  .then(sessionModel => {
    connectToActiveSession(serviceManager, sessionModel, activeSessionIds)
    .then(() => sessionFound.resolve({sessionModel, isNewSession: false}))
  })
  .catch(() => {
    connectToNewSession(serviceManager, path)
    .then(sessionModel => sessionFound.resolve({sessionModel, isNewSession: true}))
  });

  sessionFound.promise.then(results => {
    serviceManager.sessions.connectTo(results.sessionModel)
    .then(session => {
      resultsPromiseDelegate.resolve({
        session, isNewSession: results.isNewSession
      })
    })
  })

  return resultsPromiseDelegate.promise
}

function connectToActiveSession(
  serviceManager: ServiceManager, model: Session.IModel, activeSessionIds: string[]
): Promise<void> {
  let promiseDelegate = new PromiseDelegate<void>();

  if (model.id in activeSessionIds) {
    promiseDelegate.resolve(null)
  } else {
    serviceManager.sessions.connectTo(model)
    .then(session => {
      promiseDelegate.resolve(null)
    });
  }

  return promiseDelegate.promise
}


function connectToNewSession(serviceManager: ServiceManager, path: string): Promise<Session.IModel> {
  let promiseDelegate = new PromiseDelegate<Session.IModel>();

  const settings = ServerConnection.makeSettings({});
  const startNewOptions = {
    kernelName: 'python3',
    serverSettings: settings,
    path: path
  };

  serviceManager.sessions.startNew(startNewOptions).then(session => {
    promiseDelegate.resolve(session.model)
  });

  return promiseDelegate.promise
}

