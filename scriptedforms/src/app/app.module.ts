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
The root app module.
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { APP_BASE_HREF } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../vendors/material.module';

import { AppErrorHandler } from './app-error-handler';

import { KernelService } from './services/kernel.service';
import { VariableService } from './services/variable.service';
import { FileService } from './services/file.service';
import { WatchdogService } from './services/watchdog.service';
import { FormService } from './services/form.service';
import { JupyterService } from './services/jupyter.service';
import { InitialisationService } from './services/initialisation.service';
import { ToolbarService } from './services/toolbar.service';

import { FormBuilderModule } from './form-builder-module/form-builder.module';
import { ToolbarModule } from './toolbar-module/toolbar.module';

import { ToolbarButtonComponent } from './toolbar-module/toolbar-button.component';

import { AppComponent } from './app.component';

const SF_CONFIG = document.getElementById('scriptedforms-config-data');
const JLAB_CONFIG = document.getElementById('jupyter-config-data');

let config: { baseUrl: string };

if (SF_CONFIG) {
  config = JSON.parse(SF_CONFIG.textContent);
} else {
  config = JSON.parse(JLAB_CONFIG.textContent);
}

const baseUrl = config.baseUrl;


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MaterialModule,
    FormBuilderModule,
    ToolbarModule
  ],
  entryComponents: [AppComponent, ToolbarButtonComponent],
  providers: [
    KernelService,
    VariableService,
    FileService,
    WatchdogService,
    FormService,
    JupyterService,
    InitialisationService,
    ToolbarService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: APP_BASE_HREF, useValue: baseUrl }
  ],
  exports: [
    AppComponent,
  ]
})
export class AppModule {
  ngDoBootstrap(app: ApplicationRef) { }
}
