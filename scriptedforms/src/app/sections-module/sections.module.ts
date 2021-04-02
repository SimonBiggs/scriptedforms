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

import {
  MatButtonModule, MatIconModule
} from '@angular/material';

import { CodeModule } from '../code-module/code.module';

import { SectionBaseComponent } from './section-base.component';

import { StartComponent } from './start.component';
import { LiveComponent } from './live.component';
import { ButtonComponent } from './button.component';
import { OutputComponent } from './output.component';
import { SectionFileChangeComponent } from './section-file-change.component';

import { VariablesModule } from '../variables-module/variables.module';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    VariablesModule,
    CodeModule
  ],
  declarations: [
    SectionBaseComponent,
    StartComponent,
    LiveComponent,
    ButtonComponent,
    OutputComponent,
    SectionFileChangeComponent
  ],
  exports: [
    StartComponent,
    LiveComponent,
    ButtonComponent,
    OutputComponent,
    SectionFileChangeComponent
  ]
})
export class SectionsModule { }
