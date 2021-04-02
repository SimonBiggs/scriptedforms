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
A module containing the form elements.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MaterialModule
} from '../../vendors/material.module';

import { VariableBaseComponent } from './variable-base.component';
import { NumberBaseComponent } from './number-base.component';

import { ToggleComponent } from './toggle.component';
import { TickComponent } from './tick.component';
import { ConditionalComponent } from './conditional.component';

import { NumberComponent } from './number.component';
import { SliderComponent } from './slider.component';
import { VariableTableComponent } from './variable-table.component';

import { StringComponent } from './string.component';
import { DropdownComponent } from './dropdown.component';
import { VariableParameterComponent } from './variable-parameter.component';

import { VariableFileComponent } from './variable-file.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [
    VariableBaseComponent,
    NumberBaseComponent,
    ToggleComponent,
    TickComponent,
    ConditionalComponent,
    NumberComponent,
    SliderComponent,
    VariableTableComponent,
    StringComponent,
    DropdownComponent,
    VariableParameterComponent,
    VariableFileComponent
  ],
  exports: [
    ToggleComponent,
    TickComponent,
    ConditionalComponent,
    NumberComponent,
    SliderComponent,
    VariableTableComponent,
    StringComponent,
    DropdownComponent,
    VariableParameterComponent,
    VariableFileComponent
  ]
})
export class VariablesModule { }
