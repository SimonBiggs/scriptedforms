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
