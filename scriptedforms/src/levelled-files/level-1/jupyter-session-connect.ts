// scriptedforms
// Copyright (C) 2017-2018 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compliance with both the Apache-2.0 AND 
// the AGPL-3.0+ in combination (the "Combined Licenses").

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at 

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the Combined Licenses is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See 
// the Combined Licenses for the specific language governing permissions and 
// limitations under the Combined Licenses.

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

// Change this to using rxjs it will look simpler in the end.
// This is a good set to trial rxjs with.
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

