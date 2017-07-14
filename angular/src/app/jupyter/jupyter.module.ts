import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material'

import { CodeComponent } from './code/code.component';

import { KernelService } from './kernel.service';
import { ImportComponent } from './import/import.component';
import { LiveComponent } from './live/live.component';
import { WaitComponent } from './wait/wait.component';
import { VariableComponent } from './variable/variable.component';
import { NumberComponent } from './number/number.component';
import { StringComponent } from './string/string.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [
    CodeComponent,
    ImportComponent,
    LiveComponent,
    WaitComponent,
    VariableComponent,
    NumberComponent,
    StringComponent
  ],
  providers: [
    KernelService
  ],
  exports: [
    CodeComponent,
    ImportComponent,
    LiveComponent,
    WaitComponent,
    VariableComponent,
    NumberComponent,
    StringComponent
  ]
})
export class JupyterModule { }
