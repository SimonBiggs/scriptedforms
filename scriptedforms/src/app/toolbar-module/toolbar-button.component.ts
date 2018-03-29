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

/*
Creates the [button] section.

A section that runs all code within it whenever the user presses the provided
button.

By calling the function `runCode` on this component all code components within
this section will be iteratively run. The button is set to call the runCode
function on click.
*/

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

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
