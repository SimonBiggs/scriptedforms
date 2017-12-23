// jupyterlab-form
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// the GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compiance with both the Apache-2.0 AND 
// the AGPL-3.0+ in combination.

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at 

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the Apache-2.0 and the AGPL-3.0+ for the specific language governing 
// permissions and limitations under the Apache-2.0 and the AGPL-3.0+.

import {
  Component, AfterViewInit
} from '@angular/core';

import { VariableBaseComponent } from './variable-base.component';
// import { Slider } from '../interfaces/slider';

// import * as  stringify from 'json-stable-stringify';

@Component({
  selector: 'app-slider',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<span class="container">{{variableName}}
  <mat-slider class="variableSlider" *ngIf="variableName" 
    [disabled]="!isFormReady"
    [(ngModel)]="variableValue"
    (ngModelChange)="variableChanged($event)"
    (blur)="onBlur()" 
    (focus)="onFocus()"
    [max]="max"
    [min]="min"
    [step]="step"
    [thumb-label]="true">
  </mat-slider>
</span>`,
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
  min: number
  max: number
  step: number
  // sliderValue: number

  // minVariableName: string
  // maxVariableName: string
  // stepVariableName: string

  // variableValue: Slider
  variableValue: number

  ngAfterViewInit() {
    const ngContent = String(this.variablecontainer.nativeElement.innerHTML.trim());
    const items = ngContent.split(',')
    // this.minVariableName = items[0]
    // this.maxVariableName = items[1]
    // this.stepVariableName = items[2]
    this.min = Number(items[0])
    this.max = Number(items[1])
    this.step = Number(items[2])
    
    this.variableName = items[3]
    this.myChangeDetectorRef.detectChanges();
  }

  updateVariableView(value: string | number) {
    value = Number(value)
    super.updateVariableView(value)
  }

  onVariableChange() { 
    // this.variableValue = {
    //   min: this.min,
    //   max: this.max,
    //   step: this.step,
    //   value: this.sliderValue
    // };
  }

  // testIfDifferent() {
  //   return !(stringify(this.variableValue) === stringify(this.oldVariableValue));
  // }

  // pythonValueReference() {
  //   return `json_table_to_df('${JSON.stringify(this.variableValue)}')`
  // }

  // pythonVariableReference() {
  //   return this.variableName.concat(".to_json(orient='table')")
  // }
}