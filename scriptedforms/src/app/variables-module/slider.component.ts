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

import {
  Component, AfterViewInit, Input, ViewChild
} from '@angular/core';

import { VariableBaseComponent } from './variable-base.component';
import { VariableParameterComponent } from './variable-parameter.component';
// import { Slider } from '../interfaces/slider';

// import * as  stringify from 'json-stable-stringify';

@Component({
  selector: 'variable-slider',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>
<variable-parameter #minParameter *ngIf="min">{{min}}</variable-parameter>
<variable-parameter #maxParameter *ngIf="max">{{max}}</variable-parameter>
<variable-parameter #stepParameter *ngIf="step">{{step}}</variable-parameter>
<span class="container">{{labelValue}}
  <mat-slider class="variableSlider" *ngIf="variableName"
  [disabled]="!isFormReady"
  [value]="variableValue"
  (input)="updateValue($event.value)"
  (blur)="onBlur()"
  (focus)="onFocus()"
  [max]="parameterValues.maxValue"
  [min]="parameterValues.minValue"
  [step]="parameterValues.stepValue"
  [thumbLabel]="true">
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
export class SliderComponent extends VariableBaseComponent implements AfterViewInit {
  @Input() min ?: number | string;
  @Input() max ?: number | string;
  @Input() step ?: number | string;

  @ViewChild('minParameter') minParameter: VariableParameterComponent;
  @ViewChild('maxParameter') maxParameter: VariableParameterComponent;
  @ViewChild('stepParameter') stepParameter: VariableParameterComponent;

  parameterValues: { [s: string]: number; } = {
    minValue: 0,
    maxValue: 100,
    stepValue: 1
  }

  setVariableParameterMap() {
    this.variableParameterMap = [
      [this.minParameter, 'minValue'],
      [this.maxParameter, 'maxValue'],
      [this.stepParameter, 'stepValue'],
    ]
  }

  updateValue(value: number) {
    this.variableValue = value;
    this.variableChanged();
  }
}
