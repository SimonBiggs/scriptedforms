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
