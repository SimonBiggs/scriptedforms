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

import { VariableBaseComponent } from './variable-base.component';

import {
  Component, AfterViewInit
} from '@angular/core';

@Component({
  selector: 'variable-string',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>
<mat-input-container class="variableString" *ngIf="variableName">
  <mat-label>{{labelValue}}</mat-label>
  <textarea
  [required]="required"
  matInput matTextareaAutosize
  [disabled]="!isFormReady"
  [placeholder]="placeholder"
  [(ngModel)]="variableValue"
  (ngModelChange)="variableChanged()"
  (blur)="onBlur()"
  (focus)="onFocus()"
  type="text" class="variableString"></textarea>
</mat-input-container>`,
styles: [
  `.variableString {
  width: 100%;
}
`]
})
export class StringComponent extends VariableBaseComponent implements AfterViewInit {
  variableValue: string;

  pythonValueReference() {
    const escapedString = this.variableValue
    .replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\\"');
    const valueReference = `"""${String(escapedString)}"""`;

    return valueReference;
  }

  // pythonValueReference() {
  //   return `json.loads('${JSON.stringify(this.variableValue)}')`
  // }
 }
