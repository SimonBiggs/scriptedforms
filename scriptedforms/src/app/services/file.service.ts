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
import { BehaviorSubject } from 'rxjs';

import { PromiseDelegate } from '@phosphor/coreutils';
import { DocumentRegistry } from '@jupyterlab/docregistry';

// import * as yaml from 'js-yaml';

import { JupyterService } from './jupyter.service';
import { FormService } from './form.service';
import { KernelService } from './kernel.service';
import { VariableService } from './variable.service';

// https://stackoverflow.com/a/6969486/3912576
function escapeRegExp(str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

@Injectable()
export class FileService {
  path: BehaviorSubject<string> = new BehaviorSubject('scriptedforms_default_path');
  node: HTMLElement;
  _context: DocumentRegistry.Context;

  set context(_context: DocumentRegistry.Context) {
    this._context = _context;
    this._context.pathChanged.connect(this.setPathFromContext, this);
  }

  baseUrl = this.getApplicationBaseUrl();
  renderComplete: PromiseDelegate<void>;

  constructor(
    private myFormService: FormService,
    private myJupyterService: JupyterService,
    private myKernelService: KernelService,
    private myVariableService: VariableService,
  ) { }

  getApplicationBaseUrl() {
    const SF_CONFIG = document.getElementById('scriptedforms-config-data');
    const JLAB_CONFIG = document.getElementById('jupyter-config-data');

    let config: { baseUrl: string };

    if (SF_CONFIG) {
      config = JSON.parse(SF_CONFIG.textContent);
    } else {
      config = JSON.parse(JLAB_CONFIG.textContent);
    }

    const baseUrl = `${window.location.protocol}//${window.location.host}${config.baseUrl}`;
    // console.log(baseUrl);

    return baseUrl;
  }

  setNode(node: HTMLElement) {
    this.node = node;
  }

  handleFileContents(fileContents: string) {
    const priorOverflow = this.node.scrollTop;
    this.renderComplete = new PromiseDelegate<void>();

    this.renderComplete.promise.then(() => {
      this.node.scrollTop = priorOverflow;
    });
    this.myFormService.setTemplate(fileContents);

    return this.renderComplete.promise;
  }

  loadFileContents(path: string): Promise<void> {
    return this.myJupyterService.contentsManager.get(path).then(model => {
      const fileContents: string = model.content;
      return this.handleFileContents(fileContents);
    });
  }

  setPathFromContext(): void {
    this.path.next(this.context.path);
  }

  setPath(path: string) {
    this.path.next(path);
  }

  serviceSessionInitialisation() {
    console.log('service session initialisation');
    this.myFormService.formInitialisation();
    this.myVariableService.variableInitialisation();
  }

  openFile(path: string) {
    console.log('open file');
    this.setPath(path);

    this.myKernelService.sessionConnect(path).then(() => {
      this.serviceSessionInitialisation();
      return this.loadFileContents(path);
    });
  }

  setTemplateToString(dummyPath: string, template: string) {
    this.setPath(dummyPath);

    this.myKernelService.sessionConnect(dummyPath).then(() => {
      this.serviceSessionInitialisation();
      return this.handleFileContents(template);
    });
  }

  urlToFilePath(url: string) {
    const pattern = RegExp(`^${escapeRegExp(this.baseUrl)}(.*\\.(md|yaml))`);
    const match = pattern.exec(url);
    if (match !== null) {
      return decodeURIComponent(match[1]);
    } else {
      return null;
    }
  }

  openUrl(url: string) {
    console.log('open url');
    const path = this.urlToFilePath(window.location.href);
    if (path !== null) {
      this.openFile(path);
    }
  }
}
