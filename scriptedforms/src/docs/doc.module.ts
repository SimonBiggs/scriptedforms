import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../vendors/material.module';

import { AppModule } from '../app/app.module';
import { RoutingModule } from './doc.routing';

import { DocComponent } from './doc.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [
    DocComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule,
    MaterialModule,
    AppModule
  ],
  providers: [],
  bootstrap: [DocComponent]
})
export class DocModule { }
