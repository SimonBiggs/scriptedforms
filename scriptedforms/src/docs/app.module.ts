import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
