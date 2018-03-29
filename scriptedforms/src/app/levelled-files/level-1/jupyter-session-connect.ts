// Scripted Forms -- Making GUIs easy for everyone on your team.
// Copyright (C) 2017 Simon Biggs

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version (the "AGPL-3.0+").

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License and the additional terms for more
// details.

// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

// ADDITIONAL TERMS are also included as allowed by Section 7 of the GNU
// Affrero General Public License. These aditional terms are Sections 1, 5,
// 6, 7, 8, and 9 from the Apache License, Version 2.0 (the "Apache-2.0")
// where all references to the definition "License" are instead defined to
// mean the AGPL-3.0+.

// You should have received a copy of the Apache-2.0 along with this
// program. If not, see <http://www.apache.org/licenses/LICENSE-2.0>.

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
  session: Session.ISession;
  isNewSession: boolean;
}

// Change this to using rxjs it will look simpler in the end.
// This is a good set to trial rxjs with.
export function jupyterSessionConnect(
  serviceManager: ServiceManager, path: string, activeSessionIds: string[]
): Promise<PromiseReturn> {
  const resultsPromiseDelegate = new PromiseDelegate<PromiseReturn>();

  serviceManager.sessions.findByPath(path)
  .then(sessionModel => {
    serviceManager.sessions.connectTo(sessionModel)
    .then(session => {
      resultsPromiseDelegate.resolve({
        session, isNewSession: false
      });
    });
  })
  .catch(() => {
    connectToNewSession(serviceManager, path)
    .then(results => resultsPromiseDelegate.resolve(results));
  });

  return resultsPromiseDelegate.promise;
}


function connectToNewSession(serviceManager: ServiceManager, path: string): Promise<PromiseReturn> {
  const promiseDelegate = new PromiseDelegate<PromiseReturn>();

  const settings = ServerConnection.makeSettings({});
  const startNewOptions = {
    kernelName: 'python3',
    serverSettings: settings,
    path: path
  };

  serviceManager.sessions.startNew(startNewOptions).then(session => {
    promiseDelegate.resolve({session, isNewSession: true});
  });

  return promiseDelegate.promise;
}

