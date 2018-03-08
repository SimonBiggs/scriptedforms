import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { KernelService } from "../app/services/kernel.service";
import { VariableService } from "../app/services/variable.service";
import { FileService } from "../app/services/file.service";
import { WatchdogService } from "../app/services/watchdog.service";
import { FormService } from "../app/services/form.service";
import { JupyterService } from "../app/services/jupyter.service";
import { InitialisationService } from "../app/services/initialisation.service";
import { ToolbarService } from "../app/services/toolbar.service";

import { RoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component'

import { FormBuilderModule } from "../app/form-builder-module/form-builder.module";

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    FormBuilderModule
  ],
  providers: [    
    KernelService,
    VariableService,
    FileService,
    WatchdogService,
    FormService,
    JupyterService,
    InitialisationService,
    ToolbarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
