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


import { Subscription } from 'rxjs';

import {
  Component, ContentChildren, QueryList, OnDestroy, Input, AfterViewInit,
  ViewChild
} from '@angular/core';

import { StringListParameterComponent } from "../variables-module/string-list-parameter.component";

import { WatchdogService } from '../services/watchdog.service';

import { CodeComponent } from '../code-module/code.component';

@Component({
  selector: 'section-filechange',
  template: `<variable-string-list-parameter #stringListParameterComponent *ngIf="paths">
_watchdog_path_conversion({{paths}})
</variable-string-list-parameter><ng-content></ng-content>`
})
export class SectionFileChangeComponent implements OnDestroy, AfterViewInit {
  id: number;
  watchdogSubscription: Subscription
  _sessionId: string
  pathsConverted: string[]

  @Input() paths: string

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;
  @ViewChild('stringListParameterComponent') stringListParameterComponent: StringListParameterComponent

  constructor(
    private myWatchdogService: WatchdogService
  ) { }

  set sessionId(theSessionId: string) {
    this._sessionId = theSessionId
    this.initialiseCodeSessionId(theSessionId)
  }

  updateFilepathObserver() {
    this.pathsConverted.forEach(value => {
      this.myWatchdogService.addFilepathObserver(value)
    })
  }

  ngAfterViewInit() {
    // this.updateFilepathObserver()

    this.stringListParameterComponent.variableChange.asObservable().subscribe((value: string[]) => {
      this.pathsConverted = value
      this.updateFilepathObserver()
    })

    this.watchdogSubscription = this.myWatchdogService.fileChanged.subscribe((value: string) => {
      if (this.pathsConverted) {
        if (
          (this.pathsConverted.includes(value)) || 
          (this.pathsConverted.includes(`./${value}`)) || 
          (this.pathsConverted.includes(`.\\${value}`))
        ) {
          this.runCode()
        }
      }
    })
  }

  runCode() {
    this.codeComponents.toArray().forEach(codeComponent => {
      codeComponent.runCode();
    });
  }

  ngOnDestroy() {
    this.watchdogSubscription.unsubscribe()
  }

  setId(id: number) {
    this.id = id;
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.name = '"section-file"_' + String(this.id) + '_' + String(index)
    });
  }

  initialiseCodeSessionId(sessionId: string) {
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.sessionId = sessionId
    });
  }
}
