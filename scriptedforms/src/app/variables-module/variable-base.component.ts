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


@Component({
  template: ''
})
export class VariableBaseComponent implements AfterViewInit {
  isOutput = false;
  isFormReady = false;
  isPandas = false;
  isFocus = false;

  @Input() required?: string;

  variableIdentifier: string;

  @Output() variableChange = new EventEmitter<VariableValue>();

  oldVariableValue: VariableValue = null;
  variableValue: VariableValue = null;

  @Input() name?: string;
  @Input() label?: string;
  labelValue: string;
  variableName: string;

  @Input() placeholder ? = '';

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
