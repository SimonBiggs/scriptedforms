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


import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';

import { VariableBaseComponent } from './variable-base.component';
import { VariableParameterComponent } from './variable-parameter.component';

@Component({
  selector: 'variable-dropdown',
  template: `
<span #variablecontainer *ngIf='variableName === undefined'>
  <ng-content></ng-content>
</span>
<variable-parameter #variableParameterComponent *ngIf="items">{{items}}</variable-parameter>
<mat-form-field>
  <mat-label>{{labelValue}}</mat-label>
  <mat-select
  [required]="required"
  [disabled]="!isFormReady"
  [placeholder]="placeholder"
  [(ngModel)]="variableValue"
  (ngModelChange)="variableChanged($event)"
  (blur)="onBlur()"
  (focus)="onFocus()">
    <mat-option *ngFor="let option of options" [value]="option">{{option}}</mat-option>
  </mat-select>
</mat-form-field>
<div class="jp-RenderedText" *ngIf="usedSeparator">
  <pre>
    <span class="ansi-red-fg">
      The use of commas or semicolons to separate inputs is deprecated.
      Please instead use the items html parameter like so:
      &lt;variable-dropdown
        items="[<span *ngFor="let option of deprecatedOptions.slice(0,-1)">'{{option}}', </span>'{{deprecatedOptions.slice(-1)}}']"&gt;
        {{variableName}}
      &lt;/variable-dropdown&gt;
    </span>
  </pre>
</div>`})
export class DropdownComponent extends VariableBaseComponent
  implements AfterViewInit {
  deprecatedOptions: (string | number)[] = [];
  options: (string | number)[] = [];
  usedSeparator = false;

  // Make this required once internal separators are removed
  @Input() items?: string;

  @ViewChild('variableParameterComponent') variableParameterComponent: VariableParameterComponent;


  pythonValueReference() {
    let valueReference: string;

    if (typeof this.variableValue === 'string') {
      const escapedString = String(this.variableValue)
      .replace(/\\/g, '\\\\')
      .replace(/\"/g, '\\\"');
      valueReference = `"""${String(escapedString)}"""`;
    } else {
      valueReference = String(this.variableValue);
    }
    return valueReference;
  }

  loadVariableName() {
    const element: HTMLSpanElement = this.variablecontainer.nativeElement;
    const ngContent = this.htmlDecode(element.innerHTML).trim();

    // Remove separators in version 0.8.0
    const deprecatedItems = ngContent.split(/[,;]/);
    if (deprecatedItems.length > 1) {
      this.usedSeparator = true;
    }

    this.variableName = deprecatedItems[0].trim();
    deprecatedItems.slice(1).forEach(item => {
      this.options = this.options.concat([item.trim()]);
    });

    this.deprecatedOptions = this.options;

    if (this.items) {
      this.options = this.variableParameterComponent.variableValue;
      this.variableParameterComponent.variableChange.asObservable().subscribe((value: string[]) => {
        this.options = value;
      });
    }
  }
}
