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


import { Subscription } from 'rxjs';

import {
  Component, OnDestroy, AfterViewInit
} from '@angular/core';

import { SectionBaseComponent } from './section-base.component';
import { VariableService } from '../services/variable.service';

@Component({
  selector: 'section-output',
  template: `<ng-content></ng-content><div><code *ngIf="code" class="language-python">{{code}}</code></div>`
})
export class OutputComponent extends SectionBaseComponent implements OnDestroy, AfterViewInit {
  sectionType = 'output';
  variableSubscription: Subscription;
  hasFirstSubRun = false;

  constructor(
    private myVariableService: VariableService
  ) { super(); }

  subscribeToVariableChanges() {
    this.variableSubscription = this.myVariableService.variableChangedObservable
      .subscribe(value => {
        if (this.hasFirstSubRun) {
          if (value !== null) {
            this.runCode();
          }
        } else {
          this.hasFirstSubRun = true;
        }
      });
  }

  unsubscribe() {
    this.variableSubscription.unsubscribe();
  }

  kernelReset() {
    this.unsubscribe();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
