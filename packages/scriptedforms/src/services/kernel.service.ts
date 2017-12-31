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

import { Injectable, OnInit } from '@angular/core';

import {
  Kernel, Session, ServerConnection
} from '@jupyterlab/services';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import { JupyterService } from './jupyter.service';
import { FileService } from './file.service';

import {
  sessionStartCode
} from './session-start-code';


@Injectable()
export class KernelService implements OnInit {
  sessionConnected = new PromiseDelegate<void>();

  isNewSession: boolean;

  session: Session.ISession;
  kernel: Kernel.IKernelConnection;

  queueId = 0;
  queueLog: any = {};

  queue: Promise<any> = this.sessionConnected.promise;

  constructor(
    private myJupyterService: JupyterService,
    private myFileService: FileService
  ) { }

  ngOnInit() {
    // this.sessionConnect()
  }

  sessionConnect() {   
    const settings = ServerConnection.makeSettings({});
    const path = this.myFileService.path.getValue()
    const startNewOptions = {
      kernelName: 'python3',
      serverSettings: settings,
      path: path
    };

    this.myJupyterService.serviceManager.sessions.findByPath(path).then(model => {
      Session.connectTo(model, settings).then(session => {
        // console.log(session);
        this.isNewSession = false;
        this.sessionReady(session);
        // console.log('previous session ready');
      });
    }).catch(() => {
      Session.startNew(startNewOptions).then(session => {
        // console.log(session);
        this.isNewSession = true;
        this.sessionReady(session);
        this.runCode(sessionStartCode, 'session_start_code')
        // console.log('new session ready');
      });
    });
  }

  sessionReady(session: Session.ISession) {
    this.session = session;

    this.myFileService.path.subscribe((path) => {
      this.session.setPath(path);
    })

    this.kernel = this.session.kernel;
    this.sessionConnected.resolve(undefined);
  }

  addToQueue(name: string, asyncFunction: (id: number ) => Promise<any>): Promise<any> {
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
        for (const key in this.queueLog ) {
          if (Number(key) > id && this.queueLog[key] === name) {
            runCode = false;
            break;
          }
        }
        if (runCode) {
          console.log('Run Code Queue Item');
          future = this.kernel.requestExecute({ code: code });
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
