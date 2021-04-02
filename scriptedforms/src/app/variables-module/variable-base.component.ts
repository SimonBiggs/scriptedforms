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
import { VariableParameterComponent } from './variable-parameter.component';


@Component({
  template: ''
})
export class VariableBaseComponent implements AfterViewInit {
  isOutput = false;
  isFormReady = false;
  isPandas = false;
  isFocus = false;

  parameterValues: { [s: string]: any; } = {};
  variableParameterMap: (string | VariableParameterComponent)[][] = [];

  @Input() required?: string;

  variableIdentifier: string;

  @Output() variableChange = new EventEmitter<VariableValue>();

  oldVariableValue: VariableValue = null;
  variableValue: VariableValue = null;

  @Input() name?: string;
  @Input() label?: string;
  labelValue: string;
  variableName: string;

  @Input() placeholder?= '';

  @ViewChild('variablecontainer') variablecontainer: ElementRef;

  constructor(
    public myChangeDetectorRef: ChangeDetectorRef,
    public myVariableService: VariableService,
    public myElementRef: ElementRef
  ) { }

  htmlDecode(input: string) {
    const e = document.createElement('div');
    e.innerHTML = input;
    const result = e.childNodes[0].nodeValue;
    e.remove();
    return result;
  }

  loadVariableName() {
    const element: HTMLSpanElement = this.variablecontainer.nativeElement;
    this.variableName = this.htmlDecode(element.innerHTML).trim();
  }

  setVariableParameterMap() { }

  attachVariableParameters() {
    for (let map of this.variableParameterMap) {
      const variableComponent = <VariableParameterComponent>map[0];
      console.log(map)
      const key = <string>map[1];
      this.parameterValues[key] = variableComponent.variableValue;
      console.log(variableComponent.variableName)
      console.log(variableComponent.variableValue)
      variableComponent.variableChange.asObservable().subscribe((value: any) => {
        this.parameterValues[key] = value;
        console.log(value)
      })
    }
  }

  ngAfterViewInit() {
    this.loadVariableName();

    if (this.name) {
      this.label = this.name;
      const element = <HTMLElement>this.myElementRef.nativeElement;
      const divElement = document.createElement('div');
      divElement.innerHTML = `
<pre>
  <span class="ansi-red-fg">
    The use of the "name" parameter has been deprecated. Please use the
    "label" parameter instead.

    Replace:

        &lt;variable-* name="${this.name}"&gt;${this.variableName}&lt;/variable-*&gt;

    With:

        &lt;variable-* label="${this.name}"&gt;${this.variableName}&lt;/variable-*&gt;
  </span>
</pre>
      `;
      divElement.classList.add('jp-RenderedText');
      element.appendChild(divElement);
    }

    if (this.label) {
      this.labelValue = this.label;
    } else {
      this.labelValue = this.variableName;
    }

    this.setVariableParameterMap();
    this.attachVariableParameters();

    this.myChangeDetectorRef.detectChanges();
  }



  onBlur(tableCoords?: [number, string]) {
    this.isFocus = false;
  }

  onFocus(tableCoords?: [number, string]) {
    this.isFocus = true;
  }

  pythonValueReference() {
    return `json.loads(r'${JSON.stringify(this.variableValue)}')`;
  }

  pythonVariableEvaluate() {
    return `${this.variableName}`;
  }

  testIfDifferent() {
    return this.variableValue !== this.oldVariableValue;
  }

  updateOldVariable() {
    this.oldVariableValue = JSON.parse(JSON.stringify(this.variableValue));
  }

  variableChanged() {
    if (this.testIfDifferent()) {
      const valueReference = this.pythonValueReference();
      this.myVariableService.pushVariable(this.variableIdentifier, this.variableName, valueReference)
        .then((status) => {
          if (status !== 'ignore') {
            this.variableChange.emit(this.variableValue);
          }
        });
      this.updateOldVariable();
    }
  }

  updateVariableView(value: VariableValue) {
    if (!this.isFocus) {
      if (this.variableValue !== value) {
        this.variableValue = value;
        this.updateOldVariable();
        this.variableChange.emit(this.variableValue);
      }
    }
  }

  formReady(isReady: boolean) {
    this.isFormReady = isReady;
  }

  setId(index: number) {
    this.variableIdentifier = `(${String(index)})-${this.variableName}`;
  }

  initialise() {
    this.myVariableService.initialiseVariableComponent(this);
  }
}
