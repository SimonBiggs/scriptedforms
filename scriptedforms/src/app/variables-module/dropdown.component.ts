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


import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';

import { VariableBaseComponent } from './variable-base.component';
import { VariableParameterComponent } from './variable-parameter.component';

@Component({
  selector: 'variable-dropdown',
  template: `
<span #variablecontainer *ngIf='variableName === undefined'>
  <ng-content></ng-content>
</span>
<variable-parameter #optionsParameter *ngIf="items">{{items}}</variable-parameter>
<mat-form-field class="variableDropdown">
  <mat-label>{{labelValue}}</mat-label>
  <mat-select class="variableDropdown"
  [required]="required"
  [disabled]="!isFormReady"
  [placeholder]="placeholder"
  [(ngModel)]="variableValue"
  (ngModelChange)="variableChanged($event)"
  (blur)="onBlur()"
  (focus)="onFocus()">
    <mat-option *ngFor="let option of parameterValues.optionsValue" [value]="option">{{option}}</mat-option>
  </mat-select>
</mat-form-field>`,
  styles: [
    `.variableDropdown {
  width: 100%;
}
`]
})
export class DropdownComponent extends VariableBaseComponent
  implements AfterViewInit {

  @Input() items: string;

  @ViewChild('optionsParameter') optionsParameter: VariableParameterComponent;

  parameterValues: { [s: string]: (string | number)[]; } = {
    optionsValue: []
  }

  setVariableParameterMap() {
    this.variableParameterMap = [
      [this.optionsParameter, 'optionsValue'],
    ]
  }

  pythonValueReference() {
    let valueReference: string;

    if (typeof this.variableValue === 'string') {
      const escapedString = String(this.variableValue)
        .replace(/\\/g, '\\\\')
        .replace(/\"/g, '\\\"');
      valueReference = `"""${String(escapedString)}"""`;
    } else {
      valueReference = String(this.variableValue);
    }
    return valueReference;
  }
}
