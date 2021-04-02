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

/*
Creates the [button] section.

A section that runs all code within it whenever the user presses the provided
button.

By calling the function `runCode` on this component all code components within
this section will be iteratively run. The button is set to call the runCode
function on click.
*/

import { BehaviorSubject, Subscription } from 'rxjs';

import {
  Component, Input, ElementRef, ViewChild
} from '@angular/core';

export interface IOptions {
  click?: () => void;
  href?: string;
  icon?: string;
  disable?: BehaviorSubject<boolean>;
  tooltip?: string;
}

@Component({
  selector: 'toolbar-button',
  template: `<span *ngIf="_options">
<a *ngIf="_options.href" #button
  [href]="_options.href"
  [disabled]="isDisabled"
  [title]="_options.tooltip"
  mat-icon-button>
    <mat-icon>{{_options.icon}}</mat-icon>
</a>
<button *ngIf="_options.click" #button
  (click)="_options.click()"
  [disabled]="isDisabled"
  [title]="_options.tooltip"
  mat-icon-button>
    <mat-icon>{{_options.icon}}</mat-icon>
</button>
</span>

`
})
export class ToolbarButtonComponent {
  _options: IOptions;
  @Input() set options(optionsInput: IOptions) {
    this._options = optionsInput;
    if (optionsInput.disable) {
      if (this.previousSubscription) {
        this.previousSubscription.unsubscribe();
      }
      this.previousSubscription = optionsInput.disable.subscribe(disableInput => {
        this.isDisabled = disableInput;
      });
    }
  }

  @ViewChild('button') button: ElementRef;

  previousSubscription: Subscription = null;
  isDisabled = false;

  constructor(
    public myElementRef: ElementRef
  ) { }
}
