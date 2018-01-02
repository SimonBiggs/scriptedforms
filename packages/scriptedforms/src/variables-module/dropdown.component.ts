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

import { StringBaseComponent } from './string-base.component';

import {
  Component, AfterViewInit
} from '@angular/core';

@Component({
  selector: 'variable-dropdown',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>
<mat-form-field>
  <mat-select 
    [disabled]="!isFormReady"
    [placeholder]="variableName"
    [(ngModel)]="variableValue"
    (ngModelChange)="variableChanged($event)"
    (blur)="onBlur()" 
    (focus)="onFocus()">
    <mat-option *ngFor="let option of options" [value]="option">{{option}}</mat-option>
  </mat-select>
</mat-form-field>`
})
export class DropdownComponent extends StringBaseComponent implements AfterViewInit {
  options: string[] = [];

  ngAfterViewInit() {
    const ngContent = String(this.variablecontainer.nativeElement.innerHTML.trim());
    // console.log(ngContent)
    const items = ngContent.split(',')

    // console.log(items)

    this.variableName = items[0].trim()
    items.slice(1).forEach(item => {
      this.options = this.options.concat([item.trim()])
    })
    // console.log(this.options)
    
    this.myChangeDetectorRef.detectChanges();
  }
}