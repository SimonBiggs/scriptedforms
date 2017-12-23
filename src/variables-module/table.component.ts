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

import {
  MatTableDataSource
} from '@angular/material';

import * as  stringify from 'json-stable-stringify';

import { VariableBaseComponent } from './variable-base.component';
import { PandasTable } from '../interfaces/pandas-table'

@Component({
  selector: 'app-table',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<div class="container mat-elevation-z8" >
  <mat-table #table [dataSource]="dataSource" *ngIf="variableValue">
    <ng-container [matColumnDef]="column" *ngFor="let column of columnDefs; let i = index">
      <mat-header-cell *matHeaderCellDef> {{column}} </mat-header-cell>
      <mat-cell *matCellDef="let row; let j = index">
        <span *ngIf="column == variableValue.schema.primaryKey || isOutput">
          {{row[column]}}
        </span>
        <mat-input-container *ngIf="column != variableValue.schema.primaryKey && !isOutput">
          <input
            matInput
            (blur)="onBlur([j, column])"
            (focus)="onFocus([j, column])"
            [disabled]="!isFormReady"
            [(ngModel)]="row[column]"
            (ngModelChange)="variableChanged($event)"
            type="number">
        </mat-input-container>
      </mat-cell>
    </ng-container>

    <mat-header-row *matHeaderRowDef="columnDefs"></mat-header-row>
    <mat-row *matRowDef="let row; columns: columnDefs;"></mat-row>
  </mat-table>
</div>
`,
styles: [
`
.container {
  display: flex;
  flex-direction: column;
  min-width: 300px;
}

.mat-form-field {
  font-size: 14px;
  width: 100%;
}

.mat-table {
  overflow: auto;
  max-height: 500px;
}
`]
})
export class TableComponent extends VariableBaseComponent implements AfterViewInit {
  columnDefs: string[] = []
  oldColumnDefs: string[] = []
  dataSource: MatTableDataSource<{
    [key: string]: string | number 
  }> = new MatTableDataSource();

  variableValue: PandasTable
  oldVariableValue: PandasTable
  isPandas = true
  focus: [number, string] = [null, null];

  updateVariableView(value: PandasTable) {
    let numRowsUnchanged: boolean
    if (this.variableValue) {
      numRowsUnchanged = (
        value.data.length == this.variableValue.data.length
      )
    } else {
      numRowsUnchanged = false
    }
    this.variableValue = value;

    let columns: string[] = []
    value.schema.fields.forEach(val => {
      columns.push(val.name)
    })
    this.oldColumnDefs = this.columnDefs
    this.columnDefs = columns

    const columnsUnchanged = (
      this.oldColumnDefs.length == this.columnDefs.length && 
      this.columnDefs.every(
        (item, index) => { return item === this.oldColumnDefs[index] })
    )

    if (columnsUnchanged && numRowsUnchanged) {
      value.data.forEach((row, i) => {
        const keys = Object.keys(row)
        keys.forEach((key, j) => {
          if ((i !== this.focus[0]) || (key !== this.focus[1])) {
            if (this.oldVariableValue.data[i][key] !== row[key]) {
              this.dataSource.data[i][key] = row[key];
              this.oldVariableValue.data[i][key] = row[key];
            }
          }
        })
      })
    } else {
      this.dataSource.data = value.data;
      this.updateOldVariable()
    }
  }

  onVariableChange() { 
    this.variableValue.data = JSON.parse(JSON.stringify(this.dataSource.data));
  }

  testIfDifferent() {
    return !(stringify(this.variableValue) === stringify(this.oldVariableValue));
  }

  pythonValueReference() {
    return `json_table_to_df('${JSON.stringify(this.variableValue)}')`
  }

  pythonVariableReference() {
    return this.variableName.concat(".to_json(orient='table')")
  }

  onBlur(tableCoords: [number, string]) {
    this.focus = [null, null];
  }

  onFocus(tableCoords: [number, string]) {
    this.focus = tableCoords;
  }
}

