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
    Session.connectTo(model, settings).then(session => {
      sessionReady.resolve(session);
    });
  }).catch(() => {
    Session.startNew(startNewOptions).then(session => {
      session.kernel.requestExecute({code: watchdogDevModeCode});
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

