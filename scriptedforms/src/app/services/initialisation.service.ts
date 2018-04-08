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
  ) {}

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
