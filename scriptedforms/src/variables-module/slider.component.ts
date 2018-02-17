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

import {
  Component, AfterViewInit, Input
} from '@angular/core';

import { NumberBaseComponent } from './number-base.component';
// import { Slider } from '../interfaces/slider';

// import * as  stringify from 'json-stable-stringify';

@Component({
  selector: 'variable-slider',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<span class="container">{{placeholderValue}}
  <mat-slider class="variableSlider" *ngIf="variableName" 
  [required]="required"
  [disabled]="!isFormReady"
  [(ngModel)]="variableValue"
  (ngModelChange)="variableChanged()"
  (blur)="onBlur()" 
  (focus)="onFocus()"
  [max]="max"
  [min]="min"
  [step]="step"
  [thumb-label]="true">
  </mat-slider>
</span>
<div class="jp-RenderedText" *ngIf="usedSeparator">
  <pre>
  <span class="ansi-red-fg">
  The use of commas or semicolons to separate inputs is deprecated. 
  Please instead use html parameters like so:
  &lt;variable-slider min="{{min}}" max="{{max}}" step="{{step}}"&gt;{{variableName}}&lt;/variable-slider&gt;
</span>
  </pre>
</div>`,
styles: [
  `
.container {
  display: flex;
}
  
.variableSlider {
  flex-grow: 1;
}
`]
})
export class SliderComponent extends NumberBaseComponent implements AfterViewInit {
  @Input() min?: number = 0;
  @Input() max?: number = 100;
}