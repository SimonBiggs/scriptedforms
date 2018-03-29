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

/*
The root app module.
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  exports: [
    AppComponent,
  ]
})
export class AppModule {
  ngDoBootstrap(app: ApplicationRef) {}
}
