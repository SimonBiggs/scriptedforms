// scriptedforms
// Copyright (C) 2017 Simon Biggs

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

/*
This service handles all communication to the Python Kernel.

It defines a queue with the aim to only ever send one request to the kernel
at a time and in a well defined order. This queue also handles dropping repeat
requests if the kernel is busy.
*/

import { Injectable } from '@angular/core';

import {
  Kernel, Session, ServerConnection
} from '@jupyterlab/services';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import { JupyterService } from './jupyter.service';

import {
  sessionStartCode
} from './session-start-code';


export interface SessionStore {
  [sessionId: string]: { 
    session: Session.ISession;
    kernel: Kernel.IKernelConnection;
    queueId: number;
    queueLog: {[queueId: number]: string};
    queue: Promise<any>;
    isNewSession: boolean;
  }
}

@Injectable()
export class KernelService {
  sessionConnected: PromiseDelegate<string>
  sessionStore: SessionStore = {}
  currentSession: string = null;

  constructor(
    private myJupyterService: JupyterService
  ) { }

  // Set 

  // get session() {
  //   return this.sessionStore[this.currentSession].session
  // }

  // get kernel() {
  //   return this.sessionStore[this.currentSession].kernel
  // }

  // get queueId() {
  //   return this.sessionStore[this.currentSession].queueId
  // }

  // set queueId(queueId: number) {
  //   this.sessionStore[this.currentSession].queueId = queueId
  // }

  // get queueLog() {
  //   return this.sessionStore[this.currentSession].queueLog
  // }

  // get queue() {
  //   return this.sessionStore[this.currentSession].queue
  // }

  // set queue(queue) {
  //   this.sessionStore[this.currentSession].queue = queue
  // }

  // get isNewSession() {
  //   return this.sessionStore[this.currentSession].isNewSession
  // }

  // set isNewSession(isNewSession) {
  //   this.sessionStore[this.currentSession].isNewSession = isNewSession
  // }

  // loadingForm() {
  //   this.currentSession = null;
  //   this.sessionConnected = new PromiseDelegate<string>();
  //   // this.queue = this.sessionConnected.promise
  // }

  sessionConnect(path: string): Promise<string> {
    this.sessionConnected = new PromiseDelegate<string>();
    this.sessionConnected.promise.then(() => {
      console.log(this.sessionStore)
    })

    const settings = ServerConnection.makeSettings({});
    const startNewOptions = {
      kernelName: 'python3',
      serverSettings: settings,
      path: path
    };

    this.myJupyterService.serviceManager.sessions.findByPath(path).then(model => {
      if (model.id in this.sessionStore) {
        this.currentSession = model.id
        this.sessionStore[model.id].isNewSession = false
        this.sessionConnected.resolve(model.id);
      } else {
        Session.connectTo(model, settings).then(session => {
          this.storeSession(session, false)
        });
      }
    }).catch(() => {
      Session.startNew(startNewOptions).then(session => {
        this.storeSession(session, true)
        this.runCode(session.id, sessionStartCode, 'session_start_code')
      });
    });

    return this.sessionConnected.promise
  }

  storeSession(session: Session.ISession, isNewSession: boolean) {
    this.sessionStore[session.id] = {
      session: session,
      kernel: session.kernel,
      queueId: 0,
      queueLog: {},
      queue: Promise.resolve(null),
      isNewSession: isNewSession
    }
    this.currentSession = session.id
    this.sessionConnected.resolve(session.id);
  }

  addToQueue(sessionId: string, name: string, asyncFunction: (id: number ) => Promise<any>): Promise<any> {
    // if (name === null) {
    //   console.log(asyncFunction)
    //   throw new RangeError('Invalid queue item')
    // }
    const currentQueueId = this.sessionStore[sessionId].queueId;

    this.sessionStore[sessionId].queueLog[currentQueueId] = name;
    console.log(this.sessionStore[sessionId].queueLog)
    this.sessionStore[sessionId].queueId += 1;
    const previous = this.sessionStore[sessionId].queue;
    return this.sessionStore[sessionId].queue = (async () => {
      await previous;
      delete this.sessionStore[sessionId].queueLog[currentQueueId];
      return asyncFunction(currentQueueId);
    })();
  }

  runCode(sessionId: string, code: string, name: string): Promise<any> {
    let future: Kernel.IFuture;
    let runCode: boolean;

    const currentQueue = this.addToQueue(
      sessionId, name, async (id: number): Promise<any> => {
        runCode = true;
        for (const key in this.sessionStore[sessionId].queueLog) {
          if (Number(key) > id && this.sessionStore[sessionId].queueLog[key] === name) {
            runCode = false;
            break;
          }
        }
        if (runCode) {
          console.log(`Executing ${name}`);
          future = this.sessionStore[sessionId].kernel.requestExecute({ code: code });
          return future;
        } else {
          return Promise.resolve();
        }
      }
    ).catch(err => {
      console.error(err);
    });
    this.addToQueue(sessionId, null, async (id: number): Promise<any> => {
      if (runCode) {
        return await future.done;
      } else {
        return Promise.resolve();
      }
    });
    return currentQueue;
  }
}
