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
  Component, ContentChildren, QueryList, AfterViewInit, Input, ViewChild, ElementRef
} from '@angular/core';

import { CodeComponent } from '../code-module/code.component';
import { KernelService } from '../services/kernel.service';
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
</div>
`
})
export class ButtonComponent implements AfterViewInit {

  @Input() inline?: string = null;

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

  @Input() conditional?: string;

  _sessionId: string;

  conditionalValue = true;

  buttonId: number;
  afterViewInit = false;
  isFormReady = false;

  codeRunning = false;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;
  @ViewChild('conditionalComponent') conditionalComponent: ConditionalComponent;

  constructor(
    private myKernelSevice: KernelService,
    public myElementRef: ElementRef
  ) { }

  ngAfterViewInit() {
    this.afterViewInit = true;

    if (this.conditional) {
      const value: any = this.conditionalComponent.variableValue;
      this.conditionalValue = value;

      this.conditionalComponent.variableChange.asObservable().subscribe((newValue: boolean) => {
        this.conditionalValue = newValue;
      });
    }
  }

  set sessionId(theSessionId: string) {
    this._sessionId = theSessionId;
    this.initialiseCodeSessionId(theSessionId);
  }

  /**
   * Run the code of all child CodeComponents
   */
  runCode() {
    if (this.afterViewInit && this.isFormReady) {
      this.codeComponents.toArray().forEach((codeComponent, index) => {
        codeComponent.runCode();
      });
      this.codeRunning = true;
      this.myKernelSevice.sessionStore[this._sessionId].queue.then(() => {
        this.codeRunning = false;
      });
    }
  }

  /**
   * Buttons are only active once the form is ready. Call this function
   * to declare that the form is ready for user interaction.
   */
  formReady(isReady: boolean) {
    this.isFormReady = isReady;
  }

  /**
   * Provide a unique id for the purpose of detecting repeat submissions.
   * In practice this isn't an issue for button sections as the button itself
   * is disabled while the submission is in progress.
   *
   * @param id A unique id among the buttons on the form
   */
  setId(id: number) {
    this.buttonId = id;
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.name = '"button"_' + String(this.buttonId) + '_' + String(index);
    });
  }

  initialiseCodeSessionId(sessionId: string) {
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.sessionId = sessionId;
    });
  }
}
