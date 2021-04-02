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

import {
  MatTableDataSource
} from '@angular/material';

import * as  stringify from 'json-stable-stringify';

import { VariableBaseComponent } from './variable-base.component';
import { PandasTable } from '../interfaces/pandas-table';

import { VariableParameterComponent } from './variable-parameter.component';

// JupyterLab doesn't have custom webpack loaders. Need to be able to
// inline the loaders so that they get picked up without having access to the
// webpack.config.js file
// See https://github.com/jupyterlab/jupyterlab/pull/4334#issuecomment-383104318
import * as htmlTemplate from 'html-loader!./variable-table.component.html';

// This is currently needed to silence the angular-language-service not finding
// a template for this component.
// Idealy I shall create a pull request which will enable the angular lanugage
// service to detect the template loading method given above.
const template = '' + htmlTemplate;


@Component({
  selector: 'variable-table',
  template: template,
  styles: [
    `
.container {
  display: flex;
  flex-direction: column;
  min-width: 300px;
}

.mat-form-field {
  width: 100%;
}
`]
})
export class VariableTableComponent extends VariableBaseComponent implements AfterViewInit {
  @Input() typeEdit?: string = null;
  @Input() inputTypes?: string;
  @Input() dropdownItems?: string;

  @ViewChild('variableInputTypes') variableInputTypes: VariableParameterComponent;
  @ViewChild('variableDropdownItems') variableDropdownItems: VariableParameterComponent;

  definedInputTypes: {} = {};
  definedDropdownItems: {} = {};
  tableIndex: (string | number)[] = [];

  availableTypes = ['string', 'number', 'integer', 'boolean'];
  types: string[] = [];
  columnDefs: (string | number)[] = [];
  oldColumnDefs: (string | number)[] = [];
  dataSource: MatTableDataSource<{
    [key: string]: string | number
  }> = new MatTableDataSource();

  variableValue: PandasTable;
  oldVariableValue: PandasTable;
  isPandas = true;
  focus: [number, string] = [null, null];

  ngAfterViewInit() {
    if (this.inputTypes) {
      if (this.variableInputTypes.variableValue) {
        this.definedInputTypes = this.variableInputTypes.variableValue;
      }
      this.variableInputTypes.variableChange.asObservable().subscribe((value: any) => {
        if (value) {
          this.definedInputTypes = value;
          // console.log(`Input Type: ${this.definedInputTypes}`);
          // console.log(this.definedInputTypes);
        }
      });
    }

    if (this.dropdownItems) {
      if (this.variableDropdownItems.variableValue) {
        this.definedDropdownItems = this.variableDropdownItems.variableValue;
      }
      this.variableDropdownItems.variableChange.asObservable().subscribe((value: any) => {
        if (value) {
          this.definedDropdownItems = value;
          // console.log(`Dropdown Items: ${this.definedDropdownItems}`);
          // console.log(this.definedDropdownItems);
        }
      });
    }

    super.ngAfterViewInit();
  }

  updateVariableView(value: PandasTable) {
    let numRowsUnchanged: boolean;
    if (this.variableValue) {
      numRowsUnchanged = (
        value.data.length === this.variableValue.data.length
      );
    } else {
      numRowsUnchanged = false;
    }
    this.variableValue = value;

    const columns: string[] = [];
    const types: string[] = [];
    this.variableValue.schema.fields.forEach(field => {
      columns.push(field.name);
      if (this.availableTypes.includes(field.type)) {
        types.push(field.type);
      } else {
        types.push('string');
      }
    });
    this.oldColumnDefs = this.columnDefs;
    this.columnDefs = columns;
    this.types = types;

    const primaryKey = this.variableValue.schema.primaryKey;
    const tableIndex: (string | number)[] = [];
    this.variableValue.data.forEach(row => {
      tableIndex.push(row[primaryKey]);
    });
    this.tableIndex = tableIndex;

    const columnsUnchanged = (
      this.oldColumnDefs.length === this.columnDefs.length &&
      this.columnDefs.every(
        (item, index) => item === this.oldColumnDefs[index])
    );

    if (columnsUnchanged && numRowsUnchanged) {
      types.forEach((type, index) => {
        if (this.oldVariableValue.schema.fields[index].type !== type) {
          this.oldVariableValue.schema.fields[index].type = type;
        }
      });
      this.variableValue.data.forEach((row, i) => {
        const keys = Object.keys(row);
        keys.forEach((key, j) => {
          if ((i !== this.focus[0]) || (key !== this.focus[1])) {
            if (this.oldVariableValue.data[i][key] !== row[key]) {
              // console.log([this.variableIdentifier, i, key]);
              this.dataSource.data[i][key] = row[key];
              this.oldVariableValue.data[i][key] = row[key];
            }
          }
        });
      });
    } else {
      this.dataSource.data = this.variableValue.data;
      this.updateOldVariable();
    }
  }

  dataChanged() {
    this.variableValue.data = JSON.parse(JSON.stringify(this.dataSource.data));
    this.variableChanged();
  }

  typesChanged() {
    let didDataChange = false;
    this.variableValue.schema.fields.forEach((field, index) => {
      if (this.oldVariableValue.schema.fields[index].type === 'boolean' && this.types[index] === 'string') {
        this.dataSource.data.forEach(row => {
          row[this.columnDefs[index]] = '';
          didDataChange = true;
        });
      }
      field.type = this.types[index];
    });
    if (didDataChange) {
      this.variableValue.data = JSON.parse(JSON.stringify(this.dataSource.data));
    }
    this.variableChanged();
  }

  testIfDifferent() {
    return !(stringify(this.variableValue) === stringify(this.oldVariableValue));
  }

  pythonValueReference() {
    return `_json_table_to_df(r'${JSON.stringify(this.variableValue)}')`;
  }

  pythonVariableEvaluate() {
    return `json.loads(${this.variableName}.to_json(orient='table'))`;
  }

  onBlur(tableCoords: [number, string]) {
    this.focus = [null, null];
  }

  onFocus(tableCoords: [number, string]) {
    this.focus = tableCoords;
  }
}

