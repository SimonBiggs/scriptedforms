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
import { BehaviorSubject } from 'rxjs';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

// import * as yaml from 'js-yaml';

import { JupyterService } from './jupyter.service';
import { FormService } from './form.service';
import { KernelService } from './kernel.service';
import { VariableService } from './variable.service';

// https://stackoverflow.com/a/6969486/3912576
function escapeRegExp(str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

@Injectable()
export class FileService {
  path: BehaviorSubject<string> = new BehaviorSubject('scriptedforms_default_path')
  renderType: 'template' | 'results'
  node: HTMLElement

  baseUrl = document.getElementsByTagName("base")[0].href

  renderComplete: PromiseDelegate<void>

  constructor(
    private myFormService: FormService,
    private myJupyterService: JupyterService,
    private myKernelService: KernelService,
    private myVariableService: VariableService,
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

  // loadResultsFile(fileContents: string, sessionId: string) {
  // }

  handleFileContents(fileContents: string, sessionId: string) {
    let priorOverflow = this.node.scrollTop
    this.renderComplete = new PromiseDelegate<void>()

    this.renderComplete.promise.then(() => {
      this.node.scrollTop = priorOverflow
    })

    if (this.renderType === 'template') {
      this.myFormService.setTemplate(fileContents, sessionId)
    }
    // if (this.renderType === 'results') {
    //   this.loadResultsFile(fileContents, sessionId)
    // }

    return this.renderComplete.promise
  }

  loadFileContents(path: string, sessionId: string): Promise<void> {
    return this.myJupyterService.contentsManager.get(path).then(model => {
      let fileContents: string = model.content
      return this.handleFileContents(fileContents, sessionId)
    })
  }

  setPath(path: string) {
    this.path.next(path);
  }

  determineRenderType(path: string) {
    let renderType: "template" | "results"
    let extension = path.split('.').pop();
    if (extension === 'md') {
      renderType = "template"
    } else if (extension === 'yaml') {
      renderType = 'results'
    } else {
      throw RangeError('File extension not recognised.')
    }

    return renderType
  }

  serviceSessionInitialisation(sessionId: string) {
    this.myFormService.formInitialisation(sessionId);
    this.myVariableService.variableInitialisation(sessionId);
  }

  openFile(path: string) {
    this.setPath(path);
    this.setRenderType(this.determineRenderType(path));
    // this.myKernelService.loadingForm()
    this.myKernelService.sessionConnect(path).then((sessionId: string) => {
      this.serviceSessionInitialisation(sessionId);
      return this.loadFileContents(path, sessionId)
    })
  }

  setTemplateToString(dummyPath: string, template: string) {
    this.setPath(dummyPath);
    this.setRenderType('template');
    this.myKernelService.sessionConnect(dummyPath).then((sessionId: string) => {
      this.serviceSessionInitialisation(sessionId);
      return this.handleFileContents(template, sessionId)
    })
  }

  urlToFilePath(url: string) {
    let pattern = RegExp(`^${escapeRegExp(this.baseUrl)}(.*\.(md|yaml))`)
    let match = pattern.exec(url)
    if (match !== null) {
      return decodeURIComponent(match[1])
    } else {
      return null
    }
  }

  openUrl(url: string) {
    let path = this.urlToFilePath(window.location.href)
    if (path !== null) {
      this.openFile(path)
    }
  }

  morphLinksToUpdateFile(links: HTMLAnchorElement[]) {
    let config = JSON.parse(document.getElementById(
      'scriptedforms-config-data'
    ).textContent)
    
    if (config.applicationToRun == 'use') {
      links.forEach(link => {
        let path = this.urlToFilePath(link.href)
        if (path !== null) {
          link.addEventListener('click', event => {
            event.preventDefault();
            window.history.pushState(null, null, link.href)
            this.openFile(path)
          })
        }
      })
    }
  }

}