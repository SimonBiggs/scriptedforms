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
Creates the [live] section.

A section that runs all code within it whenever the any VariableComponent
changes within it.

By calling the function `variableChanged` on this component all code components
within this section will be iteratively run. Changes on each contained
variable component are subscribed to and `variableChanged` function is called.
*/

import { Subscription } from 'rxjs';

import { Component, ContentChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';

import { SectionBaseComponent } from './section-base.component';

import { ToggleComponent } from '../variables-module/toggle.component';
import { TickComponent } from '../variables-module/tick.component';
import { ConditionalComponent } from '../variables-module/conditional.component';

import { NumberComponent } from '../variables-module/number.component';
import { SliderComponent } from '../variables-module/slider.component';
import { VariableTableComponent } from '../variables-module/variable-table.component';

import { StringComponent } from '../variables-module/string.component';
import { DropdownComponent } from '../variables-module/dropdown.component';

import { VariableFileComponent } from '../variables-module/variable-file.component';

import { CodeComponent } from '../code-module/code.component';

import { VariableComponent } from '../types/variable-component';

@Component({
  selector: 'section-live',
  template: `<ng-content></ng-content><div><code *ngIf="code" class="language-python">{{code}}</code></div>`
})
export class LiveComponent extends SectionBaseComponent implements AfterViewInit, OnDestroy {
  sectionType = 'live';
  variableComponents: VariableComponent[] = [];
  // hasFirstSubRun = false;

  subscriptions: Subscription[] = [];

  @ContentChildren(ToggleComponent) toggleComponents: QueryList<ToggleComponent>;
  @ContentChildren(TickComponent) tickComponents: QueryList<TickComponent>;
  @ContentChildren(ConditionalComponent) conditionalComponents: QueryList<ConditionalComponent>;

  @ContentChildren(NumberComponent) numberComponents: QueryList<NumberComponent>;
  @ContentChildren(SliderComponent) sliderComponents: QueryList<SliderComponent>;
  @ContentChildren(VariableTableComponent) variableTableComponents: QueryList<VariableTableComponent>;

  @ContentChildren(StringComponent) stringComponents: QueryList<StringComponent>;
  @ContentChildren(DropdownComponent) dropdownComponents: QueryList<DropdownComponent>;

  @ContentChildren(VariableFileComponent) variableFileComponents: QueryList<VariableFileComponent>;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.variableComponents = this.variableComponents.concat(this.toggleComponents.toArray());
    this.variableComponents = this.variableComponents.concat(this.tickComponents.toArray());
    this.variableComponents = this.variableComponents.concat(this.conditionalComponents.toArray());

    this.variableComponents = this.variableComponents.concat(this.numberComponents.toArray());
    this.variableComponents = this.variableComponents.concat(this.sliderComponents.toArray());
    this.variableComponents = this.variableComponents.concat(this.variableTableComponents.toArray());

    this.variableComponents = this.variableComponents.concat(this.stringComponents.toArray());
    this.variableComponents = this.variableComponents.concat(this.dropdownComponents.toArray());

    this.variableComponents = this.variableComponents.concat(this.variableFileComponents.toArray());
  }

  subscribe() {
    for (const variableComponent of this.variableComponents) {
      this.subscriptions.push(variableComponent.variableChange.asObservable().subscribe(value => {
        // if (this.hasFirstSubRun) {
        this.runCode();
        // } else {
        // this.hasFirstSubRun = true;
        // }
      }));
    }
  }

  unsubscribe() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  kernelReset() {
    this.unsubscribe();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
