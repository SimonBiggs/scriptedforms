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

import {
  Component, AfterViewInit, Input, ViewChild, ElementRef
} from '@angular/core';

import { SectionBaseComponent } from './section-base.component';
import { ConditionalComponent } from '../variables-module/conditional.component';

@Component({
  selector: 'section-button',
  template: `<div style="min-height: 36px;">
  <div [class.float-right]="inline === null">
    <variable-conditional #conditionalComponent *ngIf="conditional">{{conditional}}</variable-conditional>
    <button *ngIf="value"
      mat-raised-button color="accent"
      (click)="runCode()"
      [disabled]="!isFormReady || codeRunning || !conditionalValue">
      {{value}}
    </button>
    <button *ngIf="!value"
      mat-mini-fab
      (click)="runCode()"
      [disabled]="!isFormReady || codeRunning || !conditionalValue">
      <mat-icon>keyboard_return</mat-icon>
    </button>
  </div>
  <ng-content></ng-content>
  <div><code *ngIf="code" class="language-python">{{code}}</code></div>
</div>
`
})
export class ButtonComponent extends SectionBaseComponent implements AfterViewInit {
  sectionType = 'button';
  @Input() inline?: string = null;
  @Input() conditional?: string;
  conditionalValue = true;

  @ViewChild('conditionalComponent') conditionalComponent: ConditionalComponent;

  @Input() value?: string;
  @Input() set name(nameInput: string) {
    this.value = nameInput;
    const element = <HTMLElement>this.myElementRef.nativeElement;
    const divElement = document.createElement('div');
    divElement.innerHTML = `
<pre>
<span class="ansi-red-fg">
  The use of the "name" parameter has been deprecated. Please use the
  "value" parameter instead.

  Replace:

      &lt;section-button name="${this.value}"&gt;

  With:

      &lt;section-button value="${this.value}"&gt;
</span>
</pre>
    `;
    divElement.classList.add('jp-RenderedText');
    element.appendChild(divElement);
  }

  constructor(
    public myElementRef: ElementRef
  ) { super(); }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    if (this.conditional) {
      const value: any = this.conditionalComponent.variableValue;
      this.conditionalValue = value;

      this.conditionalComponent.variableChange.asObservable().subscribe((newValue: boolean) => {
        this.conditionalValue = newValue;
      });
    }
  }
}
