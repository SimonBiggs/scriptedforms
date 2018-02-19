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

// import {
//   PromiseDelegate
// } from '@phosphor/coreutils';

import { ServiceManager, ContentsManager } from "@jupyterlab/services";

import { JupyterService } from "./jupyter.service";
import { WatchdogService } from "./watchdog.service";
import { FileService } from "./file.service";
// import { KernelService } from './kernel.service'

export namespace IScriptedForms {
  export interface IOptions {
    serviceManager: ServiceManager;
    contentsManager: ContentsManager;
    node: HTMLElement;
  }
}

@Injectable()
export class InitialisationService {

  constructor(
    private myJupyterService: JupyterService,
    private myFileService: FileService,
    private myWatchdogService: WatchdogService
  ) {}

  public initiliseScriptedForms(options: IScriptedForms.IOptions) {
    this.myJupyterService.setServiceManager(options.serviceManager);
    this.myJupyterService.setContentsManager(options.contentsManager);

    this.myWatchdogService.runWatchdog();
    
    this.myFileService.setNode(options.node);
    this.myFileService.openUrl(window.location.href) 

    window.onpopstate = event => {
      this.myFileService.openUrl(window.location.href)  
    }

    // this.myWatchdogService.runWatchdogAfterFormReady();
    // this.myWatchdogService.runWatchdog();
  }
}