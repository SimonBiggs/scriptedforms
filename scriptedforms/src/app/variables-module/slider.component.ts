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
  @Input() min?: number | string;
  @Input() max?: number | string;
  @Input() step?: number | string;

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
