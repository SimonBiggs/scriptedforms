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

import { Injectable } from '@angular/core';

import { Widget } from '@phosphor/widgets';

import { ServiceManager, ContentsManager } from '@jupyterlab/services';
import { DocumentRegistry } from '@jupyterlab/docregistry';

import {
  Toolbar
} from '@jupyterlab/apputils';

import { JupyterService } from './jupyter.service';
import { WatchdogService } from './watchdog.service';
import { FileService } from './file.service';
import { ToolbarService } from './toolbar.service';

export namespace IScriptedForms {
  export interface IOptions {
    serviceManager: ServiceManager;
    contentsManager: ContentsManager;
    node: HTMLElement;
    toolbar: Toolbar<Widget>;
    context?: DocumentRegistry.Context;
  }
}

@Injectable()
export class InitialisationService {

  constructor(
    private myJupyterService: JupyterService,
    private myFileService: FileService,
    private myWatchdogService: WatchdogService,
    private myToolbarService: ToolbarService
  ) { }

  public initiliseBaseScriptedForms(options: IScriptedForms.IOptions) {
    this.myJupyterService.setServiceManager(options.serviceManager);
    this.myJupyterService.setContentsManager(options.contentsManager);

    this.myFileService.setNode(options.node);
    this.myToolbarService.setToolbar(options.toolbar);
    this.myWatchdogService.startWatchdog();
  }

  public initiliseScriptedForms(options: IScriptedForms.IOptions) {
    console.log('Initialising ScriptedForms');
    this.initiliseBaseScriptedForms(options);

    if (!options.context) {
      console.log('No Widget Context. Assuming in standalone mode.');
      this.myFileService.openUrl(window.location.href);
    } else {
      console.log('Widget context found. Assuming running as JupyterLab extension.');
      this.myFileService.context = options.context;
      this.myFileService.openFile(options.context.path);
    }

    if (!options.context) {
      window.onpopstate = event => {
        this.myFileService.openUrl(window.location.href);
      };
    }
  }
}
