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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  renderComplete: PromiseDelegate<void>;

  constructor(
    private myFormService: FormService,
    private myJupyterService: JupyterService,
    private myKernelService: KernelService,
    private myVariableService: VariableService,
  ) { }

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
    const baseUrl = document.getElementsByTagName('base')[0].href;
    const pattern = RegExp(`^${escapeRegExp(baseUrl)}(.*\.(md|yaml))`);
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
