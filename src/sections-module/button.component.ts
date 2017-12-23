// jupyterlab-form
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// the GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compiance with both the Apache-2.0 AND 
// the AGPL-3.0+ in combination.

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at 

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the Apache-2.0 and the AGPL-3.0+ for the specific language governing 
// permissions and limitations under the Apache-2.0 and the AGPL-3.0+.

/*
Creates the [button] section.

A section that runs all code within it whenever the user presses the provided
button.

By calling the function `runCode` on this component all code components within
this section will be iteratively run. The button is set to call the runCode
function on click.
*/

import {
  Component, ContentChildren, QueryList, AfterViewInit
} from '@angular/core';

import { CodeComponent } from '../code-module/code.component';
import { KernelService } from '../services/kernel.service';

@Component({
  selector: 'app-button',
  template: `
<div>
  <ng-content></ng-content>
  <div align="right">
    <button
    mat-mini-fab
    (click)="runCode()"
    [disabled]="!isFormReady || codeRunning">
      <mat-icon>keyboard_return</mat-icon>
    </button>
  </div>
</div>
`
})
export class ButtonComponent implements AfterViewInit {

  buttonId: number;
  afterViewInit = false;
  isFormReady = false;

  codeRunning = false;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  constructor(
    private myKernelSevice: KernelService
  ) { }

  ngAfterViewInit() {
    this.afterViewInit = true;
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
      this.myKernelSevice.queue.then(() => {
        this.codeRunning = false;
      });
    }
  }

  /**
   * Buttons are only active once the form is ready. Call this function
   * to declare that the form is ready for user interaction.
   */
  formReady() {
    this.isFormReady = true;
  }

  clearCodeOutput() {
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.hideOutput();
    });
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
      codeComponent.setName(
        '"button"_' + String(this.buttonId) + '_' + String(index))
    });
  }

}
