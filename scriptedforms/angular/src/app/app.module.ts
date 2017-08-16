import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule } from '@angular/material'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RoutingModule } from './app.routing';

import { ScriptedFormsModule } from './scripted-forms/scripted-forms.module';

import { AppErrorHandler } from './app-error-handler';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { TitleService } from './title.service';
import { ViewComponent } from './view/view.component';
import { TrendComponent } from './trend/trend.component';
import { EditComponent } from './edit/edit.component';
import { RecordComponent } from './record/record.component';
import { ShareComponent } from './share/share.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    ViewComponent,
    TrendComponent,
    EditComponent,
    RecordComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ScriptedFormsModule
  ],
  providers: [
    TitleService,
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
