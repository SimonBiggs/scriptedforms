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
  Component, OnDestroy, Input, AfterViewInit,
  ViewChild
} from '@angular/core';

import { SectionBaseComponent } from './section-base.component';
import { VariableParameterComponent } from '../variables-module/variable-parameter.component';

import { WatchdogService } from '../services/watchdog.service';

@Component({
  selector: 'section-filechange',
  template: `<variable-parameter #variableParameterComponent *ngIf='paths'>
_watchdog_path_conversion({{paths}})
</variable-parameter><ng-content></ng-content><code *ngIf="code" class="language-python">{{code}}</code>`
})
export class SectionFileChangeComponent extends SectionBaseComponent implements OnDestroy, AfterViewInit {
  sectionType = 'filechange';
  watchdogSubscription: Subscription;
  pathsConverted: string[];

  @Input() paths: string;

  @ViewChild('variableParameterComponent') variableParameterComponent: VariableParameterComponent;

  constructor(
    private myWatchdogService: WatchdogService
  ) { super(); }

  updateFilepathObserver() {
    this.pathsConverted.forEach(value => {
      this.myWatchdogService.addFilepathObserver(value);
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    // this.updateFilepathObserver()

    this.variableParameterComponent.variableChange.asObservable().subscribe((value: string[]) => {
      this.pathsConverted = value;
      this.updateFilepathObserver();
    });

    this.watchdogSubscription = this.myWatchdogService.fileChanged.subscribe((value: string) => {
      if (this.pathsConverted) {
        if (
          (this.pathsConverted.includes(value)) ||
          (this.pathsConverted.includes(`./${value}`)) ||
          (this.pathsConverted.includes(`.\\${value}`))
        ) {
          this.runCode();
        }
      }
    });
  }

  ngOnDestroy() {
    this.watchdogSubscription.unsubscribe();
  }
}
