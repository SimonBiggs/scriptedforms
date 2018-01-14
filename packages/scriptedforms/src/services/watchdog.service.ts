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

import { Injectable } from '@angular/core';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  ServerConnection, Session
} from '@jupyterlab/services';

import { JupyterService } from './jupyter.service';
import { FileService } from './file.service';
import { FormService } from './form.service';

import {
  watchdogCode
} from './watchdog-code'

@Injectable()
export class WatchdogService {
  formFirstPassComplete = new PromiseDelegate<void>();

  constructor(
    private myFileService: FileService,
    private myJupyterService: JupyterService,
    private myFormService: FormService
  ) { }

  runWatchdogAfterFormReady() {
    this.formFirstPassComplete.promise.then(() => {
      this.runWatchdog()
    })
  }

  runWatchdog() {
    const path = 'scriptedforms_watchdog_kernel'
    const settings = ServerConnection.makeSettings({});
    const startNewOptions = {
      kernelName: 'python3',
      serverSettings: settings,
      path: path
    };
  
    this.myJupyterService.serviceManager.sessions.findByPath(path).then(model => {
      Session.connectTo(model, settings).then(session => {
        this.watchdogFormUpdate(session)
      });
    }).catch(() => {
      Session.startNew(startNewOptions).then(session => {
        session.kernel.requestExecute({code: watchdogCode})
        this.watchdogFormUpdate(session)
      });
    });
  }

  watchdogFormUpdate(session: Session.ISession) {
    session.iopubMessage.connect((sender, msg) => {
      // console.log(sender)
      if (msg.content.text) {
        let content = String(msg.content.text).trim()
        let files = content.split("\n")
        console.log(files)
        let path = this.myFileService.path.getValue()
        let sessionId = this.myFormService.currentFormSessionId
        let match = files.some(item => {
          return (item.replace('\\', '/') === path) || (item.includes('goutputstream'))
        })
        if (match) {
          this.myFileService.loadFileContents(path, sessionId)
        }
      }
    })
  }
}