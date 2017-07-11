import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeComponent } from './code/code.component';

import { KernelService } from './kernel.service';
import { ImportComponent } from './import/import.component';
import { LiveComponent } from './live/live.component';
import { WaitComponent } from './wait/wait.component';
import { VariableComponent } from './variable/variable.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CodeComponent,
    ImportComponent,
    LiveComponent,
    WaitComponent,
    VariableComponent
  ],
  providers: [
    KernelService
  ],
  exports: [
    CodeComponent,
    ImportComponent,
    LiveComponent,
    WaitComponent,
    VariableComponent
  ]
})
export class JupyterModule { }
