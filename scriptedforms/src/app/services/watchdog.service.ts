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

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
      Session.connectTo(model, settings).then(session => {
        this.watchdogFormUpdate(session);
      });
    }).catch(() => {
      Session.startNew(startNewOptions).then(session => {
        session.kernel.requestExecute({code: startWatchdogSessionCode});
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
    this.session.kernel.requestExecute({code: addObserverPathCode(filepath)});
  }
}
