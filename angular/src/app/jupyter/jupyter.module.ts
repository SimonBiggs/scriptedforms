import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeComponent } from './code/code.component';

import { KernelService } from './kernel.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CodeComponent
  ],
  providers: [
    KernelService
  ],
  exports: [
    CodeComponent
  ]
})
export class JupyterModule { }
