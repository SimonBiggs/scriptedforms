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
  Component, ContentChildren, QueryList, AfterViewInit, ViewChildren, Input
} from '@angular/core';
import { PromiseDelegate } from '@phosphor/coreutils';

import { CodeComponent } from '../code-module/code.component';


@Component({
  template: ''
})
export class SectionBaseComponent implements AfterViewInit {
  @Input() onLoad?: string;
  @Input() code?: string;
  sectionId: number;
  sectionType: string;
  isFormReady = false;

  codeRunning = false;

  formReadyPromiseDelegate = new PromiseDelegate<void>();
  viewInitPromiseDelegate = new PromiseDelegate<void>();

  codeComponentsArray: CodeComponent[];

  @ContentChildren(CodeComponent) contentCodeComponents: QueryList<CodeComponent>;
  @ViewChildren(CodeComponent) viewCodeComponents: QueryList<CodeComponent>;

  ngAfterViewInit() {
    this.viewInitPromiseDelegate.resolve(null);
    this.codeComponentsArray = this.contentCodeComponents.toArray().concat(this.viewCodeComponents.toArray());
  }

  runCode(evenIfNotReady = false) {
    if (evenIfNotReady || this.formReady) {
      const runCodeComplete = new PromiseDelegate<null>();
      this.viewInitPromiseDelegate.promise
      .then(() => {
        this.codeRunning = true;
        this._runAllCodeComponents(runCodeComplete);
        runCodeComplete.promise.then(() => {
          this.codeRunning = false;
        });
      });
      return runCodeComplete.promise;
    } else {
      console.log(`did not run, form not ready: "${this.sectionType}"_${this.sectionId}`);
      return Promise.resolve(null);
    }

  }

  _runAllCodeComponents(runCodeComplete: PromiseDelegate<null>) {
    const promiseList: Promise<null>[] = [];
    this.codeComponentsArray.forEach((codeComponent, index) => {
      promiseList.push(codeComponent.runCode());
    });
    Promise.all(promiseList).then(() => {
      runCodeComplete.resolve(null);
    });
  }

  formReady(isReady: boolean) {
    this.formReadyPromiseDelegate.resolve(null);
    this.isFormReady = isReady;
  }

  setId(id: number) {
    this.sectionId = id;
    this.codeComponentsArray.forEach((codeComponent, index) => {
      codeComponent.name = `"${this.sectionType}"_${this.sectionId}_${index}`;
    });
  }

  kernelReset() { }
}
