import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../vendors/material.module';

import { AppModule } from '../app/app.module';
import { RoutingModule } from './doc.routing';

import { DocComponent } from './doc.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const SF_CONFIG = document.getElementById('scriptedforms-config-data');
const JLAB_CONFIG = document.getElementById('jupyter-config-data');

let config: {baseUrl: string};

if (SF_CONFIG) {
  config = JSON.parse(SF_CONFIG.textContent);
} else {
  config = JSON.parse(JLAB_CONFIG.textContent);
}

const baseUrl = config.baseUrl;

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
  providers: [
    { provide: APP_BASE_HREF, useValue: baseUrl }
  ],
  bootstrap: [DocComponent]
})
export class DocModule { }
