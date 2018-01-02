// scriptedforms
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compliance with both the Apache-2.0 AND 
// the AGPL-3.0+ in combination (the "Combined Licenses").

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at 

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the Combined Licenses is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See 
// the Combined Licenses for the specific language governing permissions and 
// limitations under the Combined Licenses.

/*
Component that handles both [string] and [number] inputs.

In the future these should be more intelligently split out. Potentially create
a base class from which the two types of inputs inherit.

The VariableComponent calls Python code to derive its value initially. Each
time the value is changed it then recalls Python code to update the value.
*/

import {
  Component
} from '@angular/core';

import { StringBaseComponent } from './string-base.component';

@Component({
  selector: 'variable-password',
  template: `<span #variablecontainer *ngIf="variableName === undefined"><ng-content></ng-content></span>
<mat-input-container class="variable-password" *ngIf="variableName">
  <input
    matInput matTextareaAutosize
    [disabled]="!isFormReady"
    [placeholder]="placeholderValue"
    [(ngModel)]="variableValue"
    (ngModelChange)="variableChanged($event)"
    (blur)="onBlur()" 
    (focus)="onFocus()"
    type="password" class="variable-password">
</mat-input-container>`,
styles: [
  `.variable-password {
  width: 100%;
}
`]
})
export class PasswordComponent extends StringBaseComponent { }