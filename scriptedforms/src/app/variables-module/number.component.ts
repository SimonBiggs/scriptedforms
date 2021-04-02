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


import { NumberBaseComponent } from './number-base.component';

import {
  Component, AfterViewInit
} from '@angular/core';

@Component({
  selector: 'variable-number',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<mat-form-field class="variableNumber" *ngIf="variableName" >
  <mat-label>{{labelValue}}</mat-label>
  <input
  [required]="required"
  matInput
  [disabled]="!isFormReady"
  [placeholder]="placeholder"
  [(ngModel)]="variableValue"
  (ngModelChange)="variableChanged($event)"
  (blur)="onBlur()"
  (focus)="onFocus()"
  [max]="max"
  [min]="min"
  [step]="step"
  type="number">
</mat-form-field>`,
  styles: [
    `.variableNumber {
    width: 200px;
  }
  `]
})
export class NumberComponent extends NumberBaseComponent implements AfterViewInit {

}
