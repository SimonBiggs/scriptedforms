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
import { BehaviorSubject } from 'rxjs';

import {
  PromiseDelegate
} from '@phosphor/coreutils';


import { JupyterService } from './jupyter.service';
import { TemplateService } from './template.service';

@Injectable()
export class FileService {
  path: BehaviorSubject<string> = new BehaviorSubject('scriptedforms_default_path')
  renderType: 'template' | 'results'
  node: HTMLElement

  renderComplete: PromiseDelegate<void>

  constructor(
    private myTemplateService: TemplateService,
    private myJupyterService: JupyterService
  ) { }

  setNode(node: HTMLElement) {
    this.node = node
  }

  setRenderType(renderType: 'template' | 'results') {
    if ((renderType !== 'template') && (renderType !== 'results')) {
      throw new RangeError('renderType must be either template or results')
    }

    this.renderType = renderType
  }

  handleFileContents(fileContents: string) {
    let priorOverflow = this.node.scrollTop
    this.renderComplete = new PromiseDelegate()
    this.renderComplete.promise.then(() => {
      this.node.scrollTop = priorOverflow
    })

    if (this.renderType === 'template') {
      this.myTemplateService.setTemplate(fileContents)
    }
    if (this.renderType === 'results') {
      console.log('not yet implemented')
    }

    return this.renderComplete.promise
  }

  loadFileContents(): Promise<void> {
    return this.myJupyterService.contentsManager.get(this.path.getValue()).then(model => {
      let fileContents: string = model.content
      return this.handleFileContents(fileContents)
    })
  }

  setPath(path: string) {
    this.path.next(path);
  }


}