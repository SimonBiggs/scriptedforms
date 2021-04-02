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

import {
  Component, AfterViewInit
} from '@angular/core';

@Component({
  selector: 'variable-toggle',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<mat-slide-toggle
[required]="required"
[(ngModel)]="variableValue"
(ngModelChange)="variableChanged()"
[disabled]="!isFormReady">
  {{labelValue}}
</mat-slide-toggle>`,
})
export class ToggleComponent extends VariableBaseComponent implements AfterViewInit { }
