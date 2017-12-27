// scriptedforms
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compiance with both the Apache-2.0 AND 
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

import './styles/style.css';

import {
  DockPanel, Widget
} from '@phosphor/widgets';

import {
  FormWidget
} from './widget';

import {
  ServiceManager, ContentsManager, ServerConnection, Session, Kernel
} from '@jupyterlab/services';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  watchdogPython
} from './watchdog';


function connectToSession(serviceManager: ServiceManager, path: string) {
  const settings = ServerConnection.makeSettings({});
  const startNewOptions = {
    kernelName: 'python3',
    serverSettings: settings,
    path: path
  };

  let sessionPromiseDelegate = new PromiseDelegate<Session.ISession>()

  serviceManager.sessions.findByPath(path).then(model => {
    Session.connectTo(model.id, settings).then(session => {
      sessionPromiseDelegate.resolve(session)
    });
  }).catch(() => {
    Session.startNew(startNewOptions).then(session => {
      sessionPromiseDelegate.resolve(session)
    });
  });

  return sessionPromiseDelegate.promise
}

function runUtilityPython(serviceManager: ServiceManager, code: string): Promise<Kernel.IFuture> {
  return connectToSession(serviceManager, 'scriptedforms_utility_kernel').then(session => {
    return session.kernel.requestExecute({code: code})
  })
}

function updateForm(contentsManager: ContentsManager, formFileName: string, formWidget: FormWidget) {
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

  let formFileName = './' + formConfig.formFile

  let formWidget = new FormWidget({serviceManager});
  updateForm(contentsManager, formFileName, formWidget)

  runUtilityPython(serviceManager, watchdogPython).then(future => {
    future.onIOPub = (msg => {
      let content = String(msg.content.text)
      if (content.trim() == formFileName.trim()) {
        updateForm(contentsManager, formFileName, formWidget)
      }
    })
  })

  let dock = new DockPanel();
  dock.id = 'dock';
  dock.addWidget(formWidget)
  window.onresize = () => { dock.update(); };
  Widget.attach(dock, document.body);
}

window.onload = main;
