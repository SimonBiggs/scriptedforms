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

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  ServerConnection, Session, KernelMessage, ServiceManager
} from '@jupyterlab/services';


export function loadDev(serviceManager = new ServiceManager()) {
  // const serviceManager = new ServiceManager();
  runDevModeWatchdog(serviceManager);
}

const watchdogDevModeCode = `
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileModifiedEvent

import scriptedforms

class MyHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if type(event) == FileModifiedEvent:
            print(os.path.abspath(event.src_path))

event_handler = MyHandler()
observer = Observer()
observer.schedule(
    event_handler,
    path=os.path.join(os.path.dirname(scriptedforms.__file__), 'lib'),
    recursive=True)
observer.start()
`;

function runDevModeWatchdog(serviceManager: ServiceManager) {
  const sessionReady = new PromiseDelegate<Session.ISession>();

  const path = '_dev_watchdog_scriptedforms';
  const settings = ServerConnection.makeSettings({});
  const startNewOptions = {
    kernelName: 'python3',
    serverSettings: settings,
    path: path
  };

  serviceManager.sessions.findByPath(path).then(model => {
    let session = Session.connectTo(model, settings)
    sessionReady.resolve(session);
  }).catch(() => {
    Session.startNew(startNewOptions).then(session => {
      session.kernel.requestExecute({ code: watchdogDevModeCode });
      sessionReady.resolve(session);
    });
  });

  sessionReady.promise.then(session => {
    session.iopubMessage.connect((sender, msg) => {
      if (KernelMessage.isErrorMsg(msg)) {
        const errorMsg: KernelMessage.IErrorMsg = msg;
        console.error(errorMsg.content);
      }
      if (msg.content.text) {
        const content = String(msg.content.text).trim();
        const files = content.split('\n');
        console.log(files);
        location.reload(true);
      }
    });
  });
}

