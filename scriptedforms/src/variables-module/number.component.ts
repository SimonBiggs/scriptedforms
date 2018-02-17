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

<mat-input-container class="variableNumber" *ngIf="variableName" >
  <input
  [required]="required"
  matInput
  [disabled]="!isFormReady"
  [placeholder]="placeholderValue"
  [(ngModel)]="variableValue"
  (ngModelChange)="variableChanged($event)"
  (blur)="onBlur()" 
  (focus)="onFocus()"
  [max]="max"
  [min]="min"
  [step]="step"
  type="number">
</mat-input-container>
<div class="jp-RenderedText" *ngIf="usedSeparator">
  <pre>
    <span class="ansi-red-fg">
      The use of commas or semicolons to separate inputs is deprecated. 
      Please instead use html parameters like so:
      &lt;variable-number min="{{min}}" max="{{max}}" step="{{step}}"&gt;{{variableName}}&lt;/variable-number&gt;
    </span>
  </pre>
</div>`,
  styles: [
    `.variableNumber {
    width: 200px;
  }
  `]
})
export class NumberComponent extends NumberBaseComponent implements AfterViewInit {

}