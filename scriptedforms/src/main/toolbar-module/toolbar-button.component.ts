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

import { BehaviorSubject, Subscription } from 'rxjs';

import {
  Component, Input, ElementRef, ViewChild
} from '@angular/core';

@Component({
  selector: 'toolbar-button',
  template: `<button #button
  (click)="click()"
  [disabled]="isDisabled"
  [title]="tooltip"
  mat-icon-button>
    <mat-icon *ngIf="!iconClass">{{icon}}</mat-icon>
    <div *ngIf="iconClass" style="width:24px; height:24px; margin: 0 0; display:inline-block"><div [class]="iconClass"></div></div>
</button>
`
})
export class ToolbarButtonComponent {
  @Input() icon: string;
  @Input() tooltip: string;
  @Input() click: () => any
  @Input() set disable(observable: BehaviorSubject<boolean>) {
    if (this.previousSubscription) {
      this.previousSubscription.unsubscribe()
    }
    this.previousSubscription = observable.subscribe(value => {
      this.isDisabled = value
    })
  }
  @Input() iconClass: string;

  @ViewChild('button') button: ElementRef;

  previousSubscription: Subscription = null
  isDisabled = false

  constructor(
    public myElementRef: ElementRef
  ) { }
}