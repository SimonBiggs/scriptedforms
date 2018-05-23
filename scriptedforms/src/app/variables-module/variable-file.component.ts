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
