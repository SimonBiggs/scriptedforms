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
  Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, Input,
  EventEmitter, Output
} from '@angular/core';

import { VariableService } from '../services/variable.service';
import { VariableValue } from '../types/variable-value';


@Component({})
export class VariableBaseComponent implements AfterViewInit {
  isOutput = false;
  isFormReady = false;
  isPandas = false;
  isFocus = false;

  @Input() required?: string;

  variableIdentifier: string

  @Output() variableChange = new EventEmitter<VariableValue>();

  oldVariableValue: VariableValue = null;
  variableValue: VariableValue;

  @Input() placeholder?: string
  placeholderValue: string
  variableName: string;

  @ViewChild('variablecontainer') variablecontainer: ElementRef;

  constructor(
    public myChangeDetectorRef: ChangeDetectorRef,
    public myVariableService: VariableService
  ) { }

   htmlDecode(input: string){
    let e = document.createElement('div');
    e.innerHTML = input;
    let result = e.childNodes[0].nodeValue;
    e.remove()
    return result;
  }

  loadVariableName() {
    let element: HTMLSpanElement = this.variablecontainer.nativeElement
    this.variableName = this.htmlDecode(element.innerHTML).trim();
  }

  ngAfterViewInit() {
    this.loadVariableName()

    if (this.placeholder) {
      this.placeholderValue = this.placeholder
    } else {
      this.placeholderValue = this.variableName
    }

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

  pythonVariableEvaluate() {
    return `json.dumps(str(${this.variableName}))`
  }

  testIfDifferent() {
    return this.variableValue != this.oldVariableValue
  }

  updateOldVariable() {
    this.oldVariableValue = JSON.parse(JSON.stringify(this.variableValue));
  }

  onVariableChange(): Promise<void> { 
    return Promise.resolve(null)
  }

  variableChanged() {
    this.onVariableChange().then(() => {
      if (this.testIfDifferent()) {
        const valueReference = this.pythonValueReference()
        this.myVariableService.pushVariable(this.variableIdentifier, this.variableName, valueReference)
        .then((status) => {
          if (status !== 'ignore') {
            this.variableChange.emit(this.variableValue);
          }
        });
        this.updateOldVariable();
      }
    })

  }

  updateVariableView(value: VariableValue) {
    if (!this.isFocus) {
      if (this.variableValue != value) {
        // console.log(this.variableName)
        this.variableValue = value
        this.updateOldVariable()
        this.variableChange.emit(this.variableValue)
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