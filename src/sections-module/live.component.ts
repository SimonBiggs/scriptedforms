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
Creates the [live] section.

A section that runs all code within it whenever the any VariableComponent
changes within it.

By calling the function `variableChanged` on this component all code components
within this section will be iteratively run. Changes on each contained
variable component are subscribed to and `variableChanged` function is called.
*/

import {
  Component, ContentChildren, QueryList, AfterViewInit
} from '@angular/core';

import { ToggleComponent } from '../variables-module/toggle.component';
import { TickComponent } from '../variables-module/tick.component';
import { NumberComponent } from '../variables-module/number.component';
import { SliderComponent } from '../variables-module/slider.component';
import { TableComponent } from '../variables-module/table.component';
import { StringComponent } from '../variables-module/string.component';

import { CodeComponent } from '../code-module/code.component';

import { VariableComponent } from '../types/variable-component';

@Component({
  selector: 'app-live',
  template: `<ng-content></ng-content>`
})
export class LiveComponent implements AfterViewInit {

  variableComponents: VariableComponent[] = []

  liveId: number;
  afterViewInit = false;
  isFormReady = false;

  @ContentChildren(ToggleComponent) toggleComponents: QueryList<ToggleComponent>;
  @ContentChildren(TickComponent) tickComponents: QueryList<TickComponent>;
  @ContentChildren(NumberComponent) numberComponents: QueryList<NumberComponent>;
  @ContentChildren(SliderComponent) sliderComponents: QueryList<SliderComponent>;
  @ContentChildren(TableComponent) tableComponents: QueryList<TableComponent>;
  @ContentChildren(StringComponent) stringComponents: QueryList<StringComponent>;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  ngAfterViewInit() {
    this.afterViewInit = true;

    this.variableComponents = this.variableComponents.concat(this.toggleComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.tickComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.numberComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.sliderComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.tableComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.stringComponents.toArray())

    for (const variableComponent of this.variableComponents) {
      variableComponent.variableChange.asObservable().subscribe(
        value => this.runCode()
      );
    }
  }

  runCode() {
    // This would be better done with a promise. It should always run, just
    // delayed until read and initialised.
    if (this.afterViewInit && this.isFormReady) {
      this.codeComponents.toArray().forEach((codeComponent, index) => {
        codeComponent.runCode();
      });
    }
  }

  clearCodeOutput() {
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.hideOutput();
    });
  }

  formReady() {
    this.isFormReady = true;
  }

  setId(id: number) {
    this.liveId = id;

    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.setName(
        '"live"_' + String(this.liveId) + '_' + String(index));
    });
  }
}
