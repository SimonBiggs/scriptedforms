// Scripted Forms -- Making GUIs easy for everyone on your team.
// Copyright (C) 2017 Simon Biggs

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*
This service handles all communication to the Python Kernel.

It defines a queue with the aim to only ever send one request to the kernel
at a time and in a well defined order. This queue also handles dropping repeat
requests if the kernel is busy.
*/

import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

import { PromiseDelegate } from '@phosphor/coreutils';

import { Kernel, Session, KernelMessage, ServerConnection, ServiceManager } from '@jupyterlab/services';

import { JupyterService } from './jupyter.service';


function jupyterSessionConnect(serviceManager: ServiceManager, path: string): Promise<Session.ISession> {
  const promiseDelegate = new PromiseDelegate<Session.ISession>();

  serviceManager.sessions.findByPath(path)
    .then(sessionModel => {
      let session = serviceManager.sessions.connectTo(sessionModel)
      promiseDelegate.resolve(session);
    })
    .catch(() => {
      connectToNewSession(serviceManager, path)
        .then(session => promiseDelegate.resolve(session));
    });

  return promiseDelegate.promise;
}

function connectToNewSession(serviceManager: ServiceManager, path: string): Promise<Session.ISession> {
  const promiseDelegate = new PromiseDelegate<Session.ISession>();

  const settings = ServerConnection.makeSettings({});
  const startNewOptions = {
    kernelName: 'python3',
    serverSettings: settings,
    path: path
  };

  serviceManager.sessions.startNew(startNewOptions)
    .then(session => promiseDelegate.resolve(session));

  return promiseDelegate.promise;
}

@Injectable()
export class KernelService {
  session: Session.ISession;
  kernel: Kernel.IKernelConnection;
  kernelStatus: BehaviorSubject<Kernel.Status> = new BehaviorSubject(null);
  jupyterError: BehaviorSubject<KernelMessage.IErrorMsg> = new BehaviorSubject(null);

  queueId: number;
  queueLog: { [queueId: number]: string };
  queue: Promise<any>;
  queueLength: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(
    private myJupyterService: JupyterService
  ) { }

  sessionConnect(path: string): Promise<Session.ISession> {
    const sessionConnected = new PromiseDelegate<Session.ISession>();

    jupyterSessionConnect(this.myJupyterService.serviceManager, path)
      .then(session => {
        console.log(`Connection request to Jupyter Session: ${path}`);

        this.session = session;
        this.kernel = session.kernel;
        this.queueId = 0;
        this.queueLog = {};
        this.queue = Promise.resolve(null);

        this.runCode('# KernelTest', '"KernelTest"').then(future => {
          future.done.then(() => sessionConnected.resolve(session));
        });

        session.iopubMessage.connect((_, msg) => {
          if (KernelMessage.isErrorMsg(msg)) {
            const errorMsg: KernelMessage.IErrorMsg = msg;
            console.error(errorMsg.content);
            this.jupyterError.next(msg);
          }
          if (KernelMessage.isStatusMsg(msg)) {
            this.kernelStatus.next(msg.content.execution_state);
          }
        });
      });

    return sessionConnected.promise;
  }

  queueReset() {
    console.log('queue reset');
    this.queueId = 0;
    this.queueLog = {};
    this.queue = Promise.resolve(null);
  }

  restartKernel(): Promise<Session.ISession> {
    const sessionConnected = new PromiseDelegate<Session.ISession>();
    this.kernel.restart().then(() => {
      // this.queueReset();

      sessionConnected.resolve(this.session);
    });

    return sessionConnected.promise;
  }

  addToQueue(name: string, asyncFunction: (id: number) => Promise<any>): Promise<any> {
    if (name) {
      console.log(`queue: add ${name}`);
    }
    const currentQueueId = this.queueId;

    this.queueLog[currentQueueId] = name;
    this.queueId += 1;
    const previous = this.queue;
    return this.queue = (async () => {
      await previous;
      delete this.queueLog[currentQueueId];
      return asyncFunction(currentQueueId);
    })();
  }

  runCode(code: string, name: string): Promise<any> {
    let future: Kernel.IFuture;
    let runCode: boolean;

    const currentQueue = this.addToQueue(
      name, async (id: number): Promise<any> => {
        runCode = true;
        for (const key in this.queueLog) {
          if (Number(key) > id && this.queueLog[key] === name) {
            runCode = false;
            break;
          }
        }
        if (runCode) {
          console.log(`queue: run ${name}`);
          const addCommentCode = `# ${name}\n${code}`;
          future = this.kernel.requestExecute({ code: addCommentCode });
          future.done.then(() => {
            this.queueLength.next(Object.keys(this.queueLog).length);
          });
          return future;
        } else {
          return Promise.resolve();
        }
      }
    ).catch(err => {
      console.error(err);
    });
    this.addToQueue(null, async (id: number): Promise<any> => {
      if (runCode) {
        return await future.done;
      } else {
        return Promise.resolve();
      }
    });
    return currentQueue;
  }
}
