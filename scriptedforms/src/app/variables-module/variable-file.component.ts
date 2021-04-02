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


import { VariableBaseComponent } from './variable-base.component';

import { Component, AfterViewInit, OnInit } from '@angular/core';

import * as htmlTemplate from 'html-loader!./variable-file.component.html';
const template = '' + htmlTemplate;

@Component({
  selector: 'variable-file',
  template: template
})
export class VariableFileComponent extends VariableBaseComponent implements OnInit, AfterViewInit {
  variableValue: number[];
  reader = new FileReader();

  ngOnInit() {
    this.reader.onload = () => this.onFileLoaded();
  }

  fileChanged(event: any) {
    const file = event.target.files[0];
    this.reader.readAsArrayBuffer(file);
  }

  onFileLoaded() {
    const fileArray = new Int8Array(this.reader.result);
    // const encoded = String.fromCharCode.apply(null, fileArray);
    // const b64encoded = btoa(this.decoder.decode(fileArray));
    this.variableValue = Array.from(fileArray);
    console.log(this.variableValue);
    this.variableChanged();
  }

  pythonValueReference() {
    return `bytes(json.loads(r'${JSON.stringify(this.variableValue)}'))`;
  }

  pythonVariableEvaluate() {
    return `int.from_bytes(${this.variableName}, byteorder='little', signed=False)`;
  }
}
