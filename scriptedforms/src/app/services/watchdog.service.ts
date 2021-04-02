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

import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  ServerConnection, Session, KernelMessage
} from '@jupyterlab/services';

import { JupyterService } from './jupyter.service';
import { FileService } from './file.service';

import {
  startWatchdogSessionCode, addObserverPathCode
} from './watchdog-code';

@Injectable()
export class WatchdogService {
  // formFirstPassComplete = new PromiseDelegate<void>();
  everythingIdle = new PromiseDelegate<void>();
  session: Session.ISession;
  watchdogError: BehaviorSubject<KernelMessage.IErrorMsg> = new BehaviorSubject(null);
  fileChanged: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private myFileService: FileService,
    private myJupyterService: JupyterService,
  ) { }

  startWatchdog() {
    const path = '_watchdog_scriptedforms';
    const settings = ServerConnection.makeSettings({});
    const startNewOptions = {
      kernelName: 'python3',
      serverSettings: settings,
      path: path
    };

    this.myJupyterService.serviceManager.sessions.findByPath(path).then(model => {
      let session = Session.connectTo(model, settings)
      this.watchdogFormUpdate(session);
    }).catch(() => {
      Session.startNew(startNewOptions).then(session => {
        session.kernel.requestExecute({ code: startWatchdogSessionCode });
        this.watchdogFormUpdate(session);
      });
    });
  }

  watchdogFormUpdate(session: Session.ISession) {
    this.session = session;

    session.iopubMessage.connect((sender, msg) => {
      if (KernelMessage.isErrorMsg(msg)) {
        const errorMsg: KernelMessage.IErrorMsg = msg;
        console.error(errorMsg.content);
        this.watchdogError.next(msg);
      }
      if (msg.content.text) {
        const content = String(msg.content.text).trim();
        const files = content.split('\n');
        console.log(files);
        const path = this.myFileService.path.getValue();
        const match = files.some(item => {
          return (
            (item.startsWith('relative: ')) &&
            ((item.replace('\\', '/') === `relative: ${path}`) || (item.includes('goutputstream'))));
        });
        if (match) {
          this.myFileService.loadFileContents(path);
        }

        files.forEach(item => {
          const pathOnly = item.replace('absolute: ', '').replace('relative: ', '');
          this.fileChanged.next(pathOnly);
        });
      }
    });
    this.myFileService.path.subscribe(value => {
      console.log(`File service path changed to: ${value}`);
      this.addFilepathObserver(value);
    });
  }

  addFilepathObserver(filepath: string) {
    console.log(`Watchdog service: Adding ${filepath} to watch list`);
    this.session.kernel.requestExecute({ code: addObserverPathCode(filepath) });
  }
}
