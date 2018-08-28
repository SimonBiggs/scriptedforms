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
`]})
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
