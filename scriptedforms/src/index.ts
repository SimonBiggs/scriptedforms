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

import './style.css';

import {
  Widget
} from '@phosphor/widgets';

import {
  FormWidget
} from '../../packages/scriptedforms';

import {
  ServiceManager, ContentsManager, ServerConnection, Session
} from '@jupyterlab/services';

import {
  importsPython, watchdogPython, loopPython
} from './watchdog';


function runWatchdog(serviceManager: ServiceManager, contentsManager: ContentsManager, formWidget: FormWidget, formFileName: string) {
  const path = 'scriptedforms_watchdog_kernel'
  const settings = ServerConnection.makeSettings({});
  const startNewOptions = {
    kernelName: 'python3',
    serverSettings: settings,
    path: path
  };

  serviceManager.sessions.findByPath(path).then(model => {
    Session.connectTo(model, settings).then(session => {
      session.kernel.interrupt().then(() => {
        watchdogFormUpdate(session, contentsManager, formWidget, formFileName)
      })
    });
  }).catch(() => {
    Session.startNew(startNewOptions).then(session => {
      session.kernel.requestExecute({code: importsPython})
      session.kernel.requestExecute({code: watchdogPython})
      watchdogFormUpdate(session, contentsManager, formWidget, formFileName)
    });
  });
}

function watchdogFormUpdate(session: Session.ISession, contentsManager: ContentsManager, formWidget: FormWidget, formFileName: string) {
  let future = session.kernel.requestExecute({code: loopPython})
  future.onIOPub = (msg => {
    if (msg.content.text) {
      let content = String(msg.content.text).trim()
      let files = content.split("\n")
      console.log(files)
      let match = files.some(item => {
        return (item === formFileName) || (item.includes('goutputstream'))
      })
      if (match) {
        updateForm(contentsManager, formWidget, formFileName)
      }
    }
  })
}

function updateForm(contentsManager: ContentsManager, formWidget: FormWidget, formFileName: string) {
  contentsManager.get(formFileName).then(model => {
    let formContents = model.content
    formWidget.updateTemplate(formContents)
  })
}

function main(): void {
  let serviceManager = new ServiceManager();
  let contentsManager = new ContentsManager();
  let formConfig = JSON.parse(document.getElementById(
    'scriptedforms-config-data'
  ).textContent)

  let formFileName = formConfig.formFile

  let formWidget = new FormWidget({
    serviceManager,
    path: formFileName
  });

  updateForm(contentsManager, formWidget, formFileName)
  runWatchdog(serviceManager, contentsManager, formWidget, formFileName)

  window.onresize = () => { formWidget.update(); };
  Widget.attach(formWidget, document.body);
}

window.onload = main;
