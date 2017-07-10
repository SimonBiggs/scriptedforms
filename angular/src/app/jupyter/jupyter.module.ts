import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeComponent } from './code/code.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CodeComponent
  ],
  exports: [
    CodeComponent
  ]
})
export class JupyterModule { }
