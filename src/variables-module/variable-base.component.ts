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

/*
Component that handles both [string] and [number] inputs.

In the future these should be more intelligently split out. Potentially create
a base class from which the two types of inputs inherit.

The VariableComponent calls Python code to derive its value initially. Each
time the value is changed it then recalls Python code to update the value.
*/

import {
  Component, ViewChild, ElementRef, AfterViewInit,
  ChangeDetectorRef, EventEmitter, Output
} from '@angular/core';

import { VariableService } from '../services/variable.service';
import { VariableValue } from '../types/variable-value';


@Component({})
export class VariableBaseComponent implements AfterViewInit {
  isOutput = false;
  isFormReady = false;
  isPandas = false;
  isFocus = false;
  
  variableIdentifier: string

  @Output() variableChange = new EventEmitter<any>();
  @ViewChild('variablecontainer') variablecontainer: ElementRef;

  variableName: string;
  oldVariableValue: VariableValue = null;
  variableValue: VariableValue;

  constructor(
    public myChangeDetectorRef: ChangeDetectorRef,
    public myVariableService: VariableService
  ) { }

  ngAfterViewInit() {
    this.variableName = this.variablecontainer.nativeElement.innerHTML.trim();
    this.myChangeDetectorRef.detectChanges();
  }

  onBlur(tableCoords?: [number, string]) {
    this.isFocus = false;
  }

  onFocus(tableCoords?: [number, string]) {
    this.isFocus = true;
  }

  pythonValueReference() {
    return String(this.variableValue);
  }

  pythonVariableReference() {
    return `json.dumps(str(${this.variableName}))`
  }

  testIfDifferent() {
    return this.variableValue != this.oldVariableValue
  }

  updateOldVariable() {
    this.oldVariableValue = JSON.parse(JSON.stringify(this.variableValue));
  }

  onVariableChange() { }

  variableChanged(value: VariableValue) {
    this.onVariableChange()
    if (this.testIfDifferent()) {
      const valueReference = this.pythonValueReference()
      this.myVariableService.pushVariable(this.variableIdentifier, this.variableName, valueReference)
      .then((status) => {
        if (status !== 'ignore') {
          this.variableChange.emit(this.variableName);
        }
      });
      this.updateOldVariable();
    }
  }

  updateVariableView(value: VariableValue) {
    if (!this.isFocus) {
      if (this.variableValue != value) {
        this.variableValue = value
        this.updateOldVariable()
        this.variableChange.emit(this.variableName)
      }
    }
  }

  formReady() {
    this.isFormReady = true;
  }

  initialise(index: number) {
    this.variableIdentifier = `(${String(index)})-${this.variableName}`
    this.myVariableService.initialiseVariableComponent(this)
  }
}