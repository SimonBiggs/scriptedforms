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
import { ConditionalComponent } from '../variables-module/conditional.component';

import { NumberComponent } from '../variables-module/number.component';
import { SliderComponent } from '../variables-module/slider.component';
import { TableComponent } from '../variables-module/table.component';

import { StringComponent } from '../variables-module/string.component';
import { DropdownComponent } from '../variables-module/dropdown.component';

import { CodeComponent } from '../code-module/code.component';

import { VariableComponent } from '../types/variable-component';

@Component({
  selector: 'section-live',
  template: `<ng-content></ng-content>`
})
export class LiveComponent implements AfterViewInit {
  variableComponents: VariableComponent[] = []

  liveId: number;
  afterViewInit = false;
  isFormReady = false;

  @ContentChildren(ToggleComponent) toggleComponents: QueryList<ToggleComponent>;
  @ContentChildren(TickComponent) tickComponents: QueryList<TickComponent>;
  @ContentChildren(ConditionalComponent) conditionalComponents: QueryList<ConditionalComponent>;

  @ContentChildren(NumberComponent) numberComponents: QueryList<NumberComponent>;
  @ContentChildren(SliderComponent) sliderComponents: QueryList<SliderComponent>;
  @ContentChildren(TableComponent) tableComponents: QueryList<TableComponent>;

  @ContentChildren(StringComponent) stringComponents: QueryList<StringComponent>;
  @ContentChildren(DropdownComponent) dropdownComponents: QueryList<DropdownComponent>;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  ngAfterViewInit() {
    this.afterViewInit = true;

    this.variableComponents = this.variableComponents.concat(this.toggleComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.tickComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.conditionalComponents.toArray())

    this.variableComponents = this.variableComponents.concat(this.numberComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.sliderComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.tableComponents.toArray())

    this.variableComponents = this.variableComponents.concat(this.stringComponents.toArray())
    this.variableComponents = this.variableComponents.concat(this.dropdownComponents.toArray())

    for (const variableComponent of this.variableComponents) {
      variableComponent.variableChange.asObservable().subscribe(
        value => this.runCode()
      );
    }
  }

  set sessionId(theSessionId: string) {
    this.initialiseCodeSessionId(theSessionId)
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

  formReady(isReady: boolean) {
    this.isFormReady = isReady;
  }

  setId(id: number) {
    this.liveId = id;

    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.name = '"live"_' + String(this.liveId) + '_' + String(index)
    });
  }

  initialiseCodeSessionId(sessionId: string) {
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.sessionId = sessionId
    });
  }
}
